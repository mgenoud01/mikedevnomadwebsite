import { readData, writeData } from "./storage";

export interface ProProfile {
  bio: string;
  disponible: boolean;
  yearsExp: number;
  projectsShipped: number;
  ctfPodiums: number;
  email: string;
  github: string;
  linkedin: string;
  tiktok: string;
  instagram: string;
  skills: string[];
}

const DEFAULT_PROFILE: ProProfile = {
  bio: "Full-stack developer with a strong focus on cybersecurity. I build robust, secure and well-architected products.",
  disponible: true,
  yearsExp: 5,
  projectsShipped: 12,
  ctfPodiums: 3,
  email: "",
  github: "",
  linkedin: "",
  tiktok: "",
  instagram: "",
  skills: ["TypeScript", "Next.js", "Rust", "Node.js", "PostgreSQL", "Docker", "AWS", "Security+"],
};

export async function getProProfile(): Promise<ProProfile> {
  return readData<ProProfile>("proProfile", "proProfile.json", DEFAULT_PROFILE);
}

export async function saveProProfile(data: ProProfile): Promise<ProProfile> {
  await writeData("proProfile", "proProfile.json", data);
  return data;
}
