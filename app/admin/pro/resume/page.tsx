import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllExperiences } from "@/lib/experience";
import ResumeAdminClient from "./ResumeAdminClient";

export default async function ResumeAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const experiences = await getAllExperiences();
  return <ResumeAdminClient experiences={experiences} />;
}
