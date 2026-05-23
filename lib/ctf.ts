import { readData, writeData } from "./storage";

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

export async function getAllCTF(): Promise<CTFEntry[]> {
  return readData<CTFEntry[]>("ctf", "ctf.json", []);
}

export async function saveCTF(entries: CTFEntry[]): Promise<void> {
  await writeData("ctf", "ctf.json", entries);
}

export async function createCTF(
  data: Omit<CTFEntry, "id" | "createdAt" | "updatedAt">
): Promise<CTFEntry> {
  const entries = await getAllCTF();
  const entry: CTFEntry = {
    ...data,
    id: `ctf_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  await saveCTF(entries);
  return entry;
}

export async function updateCTF(
  id: string,
  data: Partial<CTFEntry>
): Promise<CTFEntry | null> {
  const entries = await getAllCTF();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx] = {
    ...entries[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await saveCTF(entries);
  return entries[idx];
}

export async function deleteCTF(id: string): Promise<boolean> {
  const entries = await getAllCTF();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  await saveCTF(filtered);
  return true;
}
