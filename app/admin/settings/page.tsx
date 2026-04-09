import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  return <SettingsClient />;
}
