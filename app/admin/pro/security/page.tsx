import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllCTF } from "@/lib/ctf";
import SecurityAdminClient from "./SecurityAdminClient";

export const dynamic = "force-dynamic";

export default async function SecurityAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const ctfEntries = await getAllCTF();
  return <SecurityAdminClient ctfEntries={ctfEntries} />;
}
