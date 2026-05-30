import { getAllVoyages } from "@/lib/voyages";
import { getProProfile } from "@/lib/proProfile";
import NomadeHomeClient from "./NomadeHomeClient";

export const dynamic = "force-dynamic";

export default async function NomadeHomePage() {
  const [voyages, profile] = await Promise.all([getAllVoyages(), getProProfile()]);
  return <NomadeHomeClient voyages={voyages} tiktok={(profile as any).tiktok || ""} instagram={(profile as any).instagram || ""} />;
}
