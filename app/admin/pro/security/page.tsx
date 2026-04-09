import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllCTF } from "@/lib/ctf";
import SecurityAdminClient from "./SecurityAdminClient";

export default function SecurityAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const ctfEntries = getAllCTF();
  return <SecurityAdminClient ctfEntries={ctfEntries} />;
}
