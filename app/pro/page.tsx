import { getProProfile } from "@/lib/proProfile";
import ProHomeClient from "./ProHomeClient";

export default function ProHomePage() {
  const profile = getProProfile();
  return <ProHomeClient profile={profile} />;
}
