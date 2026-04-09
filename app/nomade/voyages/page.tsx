import { getAllVoyages } from "@/lib/voyages";
import VoyagesClient from "./VoyagesClient";

export default function VoyagesPage() {
  const voyages = getAllVoyages();
  return <VoyagesClient voyages={voyages} />;
}
