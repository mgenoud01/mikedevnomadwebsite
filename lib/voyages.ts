import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "voyages.json");

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

export function getAllVoyages(): Voyage[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function getVoyageById(id: string): Voyage | null {
  return getAllVoyages().find((v) => v.id === id) || null;
}

export function saveVoyages(voyages: Voyage[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(voyages, null, 2));
}

export function createVoyage(data: Omit<Voyage, "id" | "createdAt" | "updatedAt">): Voyage {
  const voyages = getAllVoyages();
  const voyage: Voyage = {
    ...data,
    id: `voyage_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  voyages.unshift(voyage);
  saveVoyages(voyages);
  return voyage;
}

export function updateVoyage(id: string, data: Partial<Voyage>): Voyage | null {
  const voyages = getAllVoyages();
  const idx = voyages.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  voyages[idx] = { ...voyages[idx], ...data, updatedAt: new Date().toISOString() };
  saveVoyages(voyages);
  return voyages[idx];
}

export function deleteVoyage(id: string): boolean {
  const voyages = getAllVoyages();
  const filtered = voyages.filter((v) => v.id !== id);
  if (filtered.length === voyages.length) return false;
  saveVoyages(filtered);
  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
