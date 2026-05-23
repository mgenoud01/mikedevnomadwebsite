import { getAllPhotos } from "@/lib/galerie";
import { getAllVoyages } from "@/lib/voyages";
import GalerieClient from "./GalerieClient";

export const dynamic = "force-dynamic";

export default function GaleriePage() {
  const photos = getAllPhotos();
  const voyages = getAllVoyages().map((v) => ({ id: v.id, titre: v.titre, emoji: v.emoji, pays: v.pays }));
  return <GalerieClient photos={photos} voyages={voyages} />;
}
