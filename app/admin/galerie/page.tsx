import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllPhotos } from "@/lib/galerie";
import { getAllVoyages } from "@/lib/voyages";
import GalerieAdminClient from "./GalerieAdminClient";

export const dynamic = "force-dynamic";

export default async function GalerieAdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");
  const photos = await getAllPhotos();
  const voyages = (await getAllVoyages()).map((v) => ({
    id: v.id,
    titre: v.titre,
    slug: v.slug,
    emoji: v.emoji,
    pays: v.pays,
  }));
  return <GalerieAdminClient photos={photos} voyages={voyages} />;
}
