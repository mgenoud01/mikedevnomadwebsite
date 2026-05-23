/**
 * Couche de stockage hybride :
 *  - Production (Vercel) : Vercel Blob (fichiers JSON dans le cloud)
 *  - Local (npm run dev)  : fichiers JSON dans data/
 *
 * Lors du 1er appel en production, les données sont migrées automatiquement
 * depuis les fichiers JSON du build vers Blob.
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
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readFromBlob<T>(
  blobKey: string,
  defaultValue: T
): Promise<{ found: boolean; data: T }> {
  const { blobs } = await list({
    prefix: `${BLOB_PREFIX}/${blobKey}.json`,
    limit: 1,
  });

  if (blobs.length === 0) return { found: false, data: defaultValue };

  // Cache-bust pour toujours avoir la version fraîche
  const url = `${blobs[0].url}?t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { found: false, data: defaultValue };

  const data = (await res.json()) as T;
  return { found: true, data };
}

// ─── API publique ─────────────────────────────────────────────────────────────

/** Lit une collection. En prod : Blob (avec migration auto depuis JSON au 1er appel). En local : JSON. */
export async function readData<T>(
  blobKey: string,
  jsonFileName: string,
  defaultValue: T
): Promise<T> {
  if (!USE_BLOB) return readFromJsonFile(jsonFileName, defaultValue);

  try {
    const { found, data } = await readFromBlob<T>(blobKey, defaultValue);
    if (found) return data;

    // 1er appel : migrer depuis le JSON bundlé (lecture seule OK sur Vercel)
    const fileData = readFromJsonFile<T>(jsonFileName, defaultValue);
    await writeToBlob(blobKey, fileData);
    return fileData;
  } catch (err) {
    console.error(`[storage] readData(${blobKey}) error:`, err);
    return readFromJsonFile(jsonFileName, defaultValue);
  }
}

/** Écrit une collection. En prod : Blob. En local : JSON. */
export async function writeData<T>(
  blobKey: string,
  jsonFileName: string,
  value: T
): Promise<void> {
  if (!USE_BLOB) {
    writeToJsonFile(jsonFileName, value);
    return;
  }

  // Lève une erreur explicite si le token est absent au runtime
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant — vérifiez les variables d'environnement Vercel");
  }

  await writeToBlob(blobKey, value);
}
