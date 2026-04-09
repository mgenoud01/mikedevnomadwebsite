import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "proProfile.json");

export interface ProProfile {
  bio: string;
  disponible: boolean;
  yearsExp: number;
  projectsShipped: number;
  ctfPodiums: number;
  email: string;
  github: string;
  linkedin: string;
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
  skills: ["TypeScript", "Next.js", "Rust", "Node.js", "PostgreSQL", "Docker", "AWS", "Security+"],
};

export function getProProfile(): ProProfile {
  if (!fs.existsSync(DATA_FILE)) return DEFAULT_PROFILE;
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveProProfile(data: ProProfile): ProProfile {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return data;
}
