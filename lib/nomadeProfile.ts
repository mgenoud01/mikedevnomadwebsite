import { readData, writeData } from "./storage";

export interface NomadeProfile {
  tiktok: string;
  instagram: string;
}

const DEFAULT: NomadeProfile = {
  tiktok: "",
  instagram: "",
};

export async function getNomadeProfile(): Promise<NomadeProfile> {
  return readData<NomadeProfile>("nomadeProfile", "nomadeProfile.json", DEFAULT);
}

export async function saveNomadeProfile(data: NomadeProfile): Promise<NomadeProfile> {
  await writeData("nomadeProfile", "nomadeProfile.json", data);
  return data;
}
