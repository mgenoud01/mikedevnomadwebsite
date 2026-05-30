import { getAllVoyages } from "@/lib/voyages";
import { getNomadeProfile } from "@/lib/nomadeProfile";
import NomadeHomeClient from "./NomadeHomeClient";

export const dynamic = "force-dynamic";

export default async function NomadeHomePage() {
  const [voyages, nomadeProfile] = await Promise.all([getAllVoyages(), getNomadeProfile()]);
  return <NomadeHomeClient voyages={voyages} tiktok={nomadeProfile.tiktok} instagram={nomadeProfile.instagram} />;
}
