import { getAllProjects } from "@/lib/projects";
import PortfolioClient from "./PortfolioClient";

export default function PortfolioPage() {
  const projects = getAllProjects();
  return <PortfolioClient projects={projects} />;
}
