import { getAllExperiences } from "@/lib/experience";
import { getProProfile } from "@/lib/proProfile";
import CVClient from "./CVClient";

export const dynamic = "force-dynamic";

export default function CVPage() {
  const experiences = getAllExperiences();
  const profile = getProProfile();
  return <CVClient experiences={experiences} profile={profile} />;
}
