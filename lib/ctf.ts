import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "ctf.json");

export interface CTFEntry {
  id: string;
  nom: string;
  categorie: string;
  difficulte: "Easy" | "Medium" | "Hard" | "Insane";
  plateforme: string;
  date: string;
  description: string;
  writeup: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function getAllCTF(): CTFEntry[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveCTF(entries: CTFEntry[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

export function createCTF(data: Omit<CTFEntry, "id" | "createdAt" | "updatedAt">): CTFEntry {
  const entries = getAllCTF();
  const entry: CTFEntry = {
    ...data,
    id: `ctf_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  saveCTF(entries);
  return entry;
}

export function updateCTF(id: string, data: Partial<CTFEntry>): CTFEntry | null {
  const entries = getAllCTF();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx] = { ...entries[idx], ...data, updatedAt: new Date().toISOString() };
  saveCTF(entries);
  return entries[idx];
}

export function deleteCTF(id: string): boolean {
  const entries = getAllCTF();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  saveCTF(filtered);
  return true;
}
