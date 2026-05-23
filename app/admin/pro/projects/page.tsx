import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllProjects } from "@/lib/projects";
import ProjectsAdminClient from "./ProjectsAdminClient";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const projects = await getAllProjects();
  return <ProjectsAdminClient projects={projects} />;
}
