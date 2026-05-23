/**
 * Couche de stockage hybride :
 *  - Production (Vercel) : Vercel KV (Redis) via les env vars KV_REST_API_URL / KV_REST_API_TOKEN
 *  - Local (npm run dev)  : fichiers JSON dans data/
 *
 * Lors du 1er appel en production, les données sont migrées automatiquement
 * depuis les fichiers JSON présents dans le build vers KV.
 */

import fs from "fs";
import path from "path";

const USE_KV = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

type KVClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<unknown>;
};

let _kv: KVClient | null = null;

async function getKV(): Promise<KVClient | null> {
  if (!USE_KV) return null;
  if (_kv) return _kv;
  const mod = await import("@vercel/kv");
  _kv = mod.kv as KVClient;
  return _kv;
}

/** Lit une collection. En prod : KV (avec migration auto depuis JSON au 1er appel). En local : JSON. */
export async function readData<T>(
  kvKey: string,
  jsonFileName: string,
  defaultValue: T
): Promise<T> {
  const kv = await getKV();

  if (kv) {
    const cached = await kv.get<T>(kvKey);
    if (cached !== null && cached !== undefined) return cached;

    // 1er appel : migrer depuis le JSON bundlé (lecture seule OK sur Vercel)
    const filePath = path.join(process.cwd(), "data", jsonFileName);
    if (fs.existsSync(filePath)) {
      try {
        const fileData = JSON.parse(
          fs.readFileSync(filePath, "utf-8")
        ) as T;
        await kv.set(kvKey, fileData);
        return fileData;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  // Local dev : fichiers JSON
  const filePath = path.join(process.cwd(), "data", jsonFileName);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return defaultValue;
  }
}

/** Écrit une collection. En prod : KV. En local : JSON. */
export async function writeData<T>(
  kvKey: string,
  jsonFileName: string,
  value: T
): Promise<void> {
  const kv = await getKV();

  if (kv) {
    await kv.set(kvKey, value);
    return;
  }

  // Local dev : JSON
  const filePath = path.join(process.cwd(), "data", jsonFileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}
