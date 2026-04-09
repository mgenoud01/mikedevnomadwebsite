import { getAllVoyages } from "@/lib/voyages";
import NomadeHomeClient from "./NomadeHomeClient";

export default function NomadeHomePage() {
  const voyages = getAllVoyages();
  return <NomadeHomeClient voyages={voyages} />;
}
