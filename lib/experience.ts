import { readData, writeData } from "./storage";

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

export async function getAllExperiences(): Promise<Experience[]> {
  return readData<Experience[]>("experiences", "experiences.json", []);
}

export async function saveExperiences(experiences: Experience[]): Promise<void> {
  await writeData("experiences", "experiences.json", experiences);
}

export async function createExperience(
  data: Omit<Experience, "id" | "createdAt" | "updatedAt">
): Promise<Experience> {
  const experiences = await getAllExperiences();
  const experience: Experience = {
    ...data,
    id: `exp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  experiences.unshift(experience);
  await saveExperiences(experiences);
  return experience;
}

export async function updateExperience(
  id: string,
  data: Partial<Experience>
): Promise<Experience | null> {
  const experiences = await getAllExperiences();
  const idx = experiences.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  experiences[idx] = {
    ...experiences[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await saveExperiences(experiences);
  return experiences[idx];
}

export async function deleteExperience(id: string): Promise<boolean> {
  const experiences = await getAllExperiences();
  const filtered = experiences.filter((e) => e.id !== id);
  if (filtered.length === experiences.length) return false;
  await saveExperiences(filtered);
  return true;
}
