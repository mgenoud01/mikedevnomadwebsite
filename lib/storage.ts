/**
 * Couche de stockage hybride :
 *  - Production (Vercel) : Vercel Blob (fichiers JSON dans le cloud)
 *  - Local (npm run dev)  : fichiers JSON dans data/
 */

import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PREFIX = "mikedevnomad/data";

// ─── Helpers JSON locaux ─────────────────────────────────────────────────────

function readFromJsonFile<T>(jsonFileName: string, defaultValue: T): T {
  const filePath = path.join(process.cwd(), "data", jsonFileName);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return defaultValue;
  }
}

function writeToJsonFile<T>(jsonFileName: string, value: T): void {
  const filePath = path.join(process.cwd(), "data", jsonFileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

// ─── Helpers Blob ─────────────────────────────────────────────────────────────

async function writeToBlob<T>(blobKey: string, value: T): Promise<void> {
  await put(`${BLOB_PREFIX}/${blobKey}.json`, JSON.stringify(value, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

type BlobReadResult<T> =
  | { status: "found"; data: T }
  | { status: "notfound"; data: T }   // blob n'existe pas encore → migration OK
  | { status: "error"; data: T };      // blob existe mais lecture échouée → NE PAS migrer

async function readFromBlob<T>(
  blobKey: string,
  defaultValue: T
): Promise<BlobReadResult<T>> {
  const { blobs } = await list({
    prefix: `${BLOB_PREFIX}/${blobKey}.json`,
    limit: 1,
  });

  // Blob inexistant → migration depuis JSON autorisée
  if (blobs.length === 0) return { status: "notfound", data: defaultValue };

  // Blob existe → on lit avec auth + cache-bust
  const fetchUrl = `${blobs[0].url}?t=${Date.now()}`;
  const res = await fetch(fetchUrl, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });

  if (!res.ok) {
    console.error(`[storage] readFromBlob(${blobKey}) HTTP ${res.status} — blob exists, skipping migration`);
    return { status: "error", data: defaultValue };
  }

  try {
    const data = (await res.json()) as T;
    return { status: "found", data };
  } catch {
    console.error(`[storage] readFromBlob(${blobKey}) JSON parse error`);
    return { status: "error", data: defaultValue };
  }
}

// ─── API publique ─────────────────────────────────────────────────────────────

export async function readData<T>(
  blobKey: string,
  jsonFileName: string,
  defaultValue: T
): Promise<T> {
  if (!USE_BLOB) return readFromJsonFile(jsonFileName, defaultValue);

  try {
    const result = await readFromBlob<T>(blobKey, defaultValue);

    if (result.status === "found") return result.data;

    // Blob existe mais lecture échouée → retourner la valeur par défaut,
    // NE PAS réécrire le blob (ça écraserait les données réelles !)
    if (result.status === "error") {
      console.error(`[storage] readData(${blobKey}): blob read failed, returning default`);
      return result.data;
    }

    // Blob inexistant → 1er déploiement : migrer depuis le JSON bundlé
    const fileData = readFromJsonFile<T>(jsonFileName, defaultValue);
    await writeToBlob(blobKey, fileData);
    return fileData;
  } catch (err) {
    console.error(`[storage] readData(${blobKey}) unexpected error:`, err);
    return defaultValue;
  }
}

export async function writeData<T>(
  blobKey: string,
  jsonFileName: string,
  value: T
): Promise<void> {
  if (!USE_BLOB) {
    writeToJsonFile(jsonFileName, value);
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant — vérifiez les variables d'environnement Vercel");
  }

  await writeToBlob(blobKey, value);
}
