import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProProfile } from "@/lib/proProfile";
import ProfileAdminClient from "./ProfileAdminClient";

export default function ProfileAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const profile = getProProfile();
  return <ProfileAdminClient profile={profile} />;
}
