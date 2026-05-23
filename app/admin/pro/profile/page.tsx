import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProProfile } from "@/lib/proProfile";
import ProfileAdminClient from "./ProfileAdminClient";

export default async function ProfileAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const profile = await getProProfile();
  return <ProfileAdminClient profile={profile} />;
}
