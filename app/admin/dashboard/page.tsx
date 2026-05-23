import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllVoyages } from "@/lib/voyages";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const voyages = await getAllVoyages();
  return <DashboardClient voyages={voyages} />;
}
