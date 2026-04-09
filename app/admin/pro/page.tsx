import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  redirect("/admin/pro/projects");
}
