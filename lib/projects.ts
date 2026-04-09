import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

export interface Project {
  id: string;
  titre: string;
  description: string;
  stack: string[];
  lien: string;
  github: string;
  image: string;
  featured: boolean;
  status: "done" | "in-progress" | "archived";
  createdAt: string;
  updatedAt: string;
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function getProjectById(id: string): Project | null {
  return getAllProjects().find((p) => p.id === id) || null;
}

export function saveProjects(projects: Project[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

export function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const projects = getAllProjects();
  const project: Project = {
    ...data,
    id: `project_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const projects = getAllProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
  saveProjects(projects);
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}
