import { getAllExperiences } from "@/lib/experience";
import { getProProfile } from "@/lib/proProfile";
import CVClient from "./CVClient";

export const dynamic = "force-dynamic";

export default async function CVPage() {
  const experiences = await getAllExperiences();
  const profile = await getProProfile();
  return <CVClient experiences={[...experiences].reverse()} profile={profile} />;
}
