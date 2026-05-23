import { getProProfile } from "@/lib/proProfile";
import ProHomeClient from "./ProHomeClient";

export const dynamic = "force-dynamic";

export default async function ProHomePage() {
  const profile = await getProProfile();
  return <ProHomeClient profile={profile} />;
}
