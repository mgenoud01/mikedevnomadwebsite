import { getProProfile } from "@/lib/proProfile";
import ProHomeClient from "./ProHomeClient";

export const dynamic = "force-dynamic";

export default function ProHomePage() {
  const profile = getProProfile();
  return <ProHomeClient profile={profile} />;
}
