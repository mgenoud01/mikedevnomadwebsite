import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "experiences.json");

export interface Experience {
  id: string;
  entreprise: string;
  poste: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  description: string;
  competences: string[];
  actuel: boolean;
  type: "work" | "education";
  createdAt: string;
  updatedAt: string;
}

export function getAllExperiences(): Experience[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveExperiences(experiences: Experience[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(experiences, null, 2));
}

export function createExperience(data: Omit<Experience, "id" | "createdAt" | "updatedAt">): Experience {
  const experiences = getAllExperiences();
  const experience: Experience = {
    ...data,
    id: `exp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  experiences.unshift(experience);
  saveExperiences(experiences);
  return experience;
}

export function updateExperience(id: string, data: Partial<Experience>): Experience | null {
  const experiences = getAllExperiences();
  const idx = experiences.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  experiences[idx] = { ...experiences[idx], ...data, updatedAt: new Date().toISOString() };
  saveExperiences(experiences);
  return experiences[idx];
}

export function deleteExperience(id: string): boolean {
  const experiences = getAllExperiences();
  const filtered = experiences.filter((e) => e.id !== id);
  if (filtered.length === experiences.length) return false;
  saveExperiences(filtered);
  return true;
}
