import { getAllVoyages } from "@/lib/voyages";
import NomadeHomeClient from "./NomadeHomeClient";

export const dynamic = "force-dynamic";

export default async function NomadeHomePage() {
  const voyages = await getAllVoyages();
  return <NomadeHomeClient voyages={voyages} />;
}
