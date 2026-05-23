import { getAllProjects } from "@/lib/projects";
import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const projects = await getAllProjects();
  return <PortfolioClient projects={projects} />;
}
