import { readData, writeData } from "./storage";

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

export async function getAllProjects(): Promise<Project[]> {
  return readData<Project[]>("projects", "projects.json", []);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeData("projects", "projects.json", projects);
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const projects = await getAllProjects();
  const project: Project = {
    ...data,
    id: `project_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.unshift(project);
  await saveProjects(projects);
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project | null> {
  const projects = await getAllProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = {
    ...projects[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await saveProjects(projects);
  return projects[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await saveProjects(filtered);
  return true;
}
