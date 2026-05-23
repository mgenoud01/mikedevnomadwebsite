import { getAllVoyages } from "@/lib/voyages";
import VoyagesClient from "./VoyagesClient";

export const dynamic = "force-dynamic";

export default async function VoyagesPage() {
  const voyages = await getAllVoyages();
  return <VoyagesClient voyages={voyages} />;
}
