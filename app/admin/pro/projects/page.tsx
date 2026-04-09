import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllProjects } from "@/lib/projects";
import ProjectsAdminClient from "./ProjectsAdminClient";

export default function ProjectsAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const projects = getAllProjects();
  return <ProjectsAdminClient projects={projects} />;
}
