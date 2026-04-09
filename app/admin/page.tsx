import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AdminPage() {
  if (isAuthenticated()) redirect("/admin/dashboard");
  redirect("/admin/login");
}
