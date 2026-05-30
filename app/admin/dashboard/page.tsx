import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllVoyages } from "@/lib/voyages";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const voyages = await getAllVoyages();
  return <DashboardClient voyages={voyages} />;
}
