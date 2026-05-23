import { readData, writeData } from "./storage";

export interface Resto {
  id: string;
  nom: string;
  description: string;
  note: number;
  photo: string;
  adresse: string;
}

export interface Endroit {
  id: string;
  nom: string;
  description: string;
  conseil: string;
  photo: string;
  type: string;
}

export interface Voyage {
  id: string;
  titre: string;
  slug: string;
  pays: string;
  emoji: string;
  dateDebut: string;
  dateFin: string;
  resume: string;
  photoCouverture: string;
  restos: Resto[];
  endroits: Endroit[];
  galerie: string[];
  conseils: string[];
  hashtags: string[];
  budgetJour: number;
  contenu: string;
  miseEnAvant: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllVoyages(): Promise<Voyage[]> {
  return readData<Voyage[]>("voyages", "voyages.json", []);
}

export async function getVoyageById(id: string): Promise<Voyage | null> {
  const voyages = await getAllVoyages();
  return voyages.find((v) => v.id === id) || null;
}

export async function saveVoyages(voyages: Voyage[]): Promise<void> {
  await writeData("voyages", "voyages.json", voyages);
}

export async function createVoyage(
  data: Omit<Voyage, "id" | "createdAt" | "updatedAt">
): Promise<Voyage> {
  const voyages = await getAllVoyages();
  const voyage: Voyage = {
    ...data,
    id: `voyage_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  voyages.unshift(voyage);
  await saveVoyages(voyages);
  return voyage;
}

export async function updateVoyage(
  id: string,
  data: Partial<Voyage>
): Promise<Voyage | null> {
  const voyages = await getAllVoyages();
  const idx = voyages.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  voyages[idx] = {
    ...voyages[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await saveVoyages(voyages);
  return voyages[idx];
}

export async function deleteVoyage(id: string): Promise<boolean> {
  const voyages = await getAllVoyages();
  const filtered = voyages.filter((v) => v.id !== id);
  if (filtered.length === voyages.length) return false;
  await saveVoyages(filtered);
  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
