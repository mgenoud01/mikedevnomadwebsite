import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllVoyages } from "@/lib/voyages";
import Link from "next/link";
import Image from "next/image";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const voyages = getAllVoyages();
  return <DashboardClient voyages={voyages} />;
}
