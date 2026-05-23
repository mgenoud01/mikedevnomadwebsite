import { getAllVoyages } from "@/lib/voyages";
import { getAllPhotos } from "@/lib/galerie";
import { notFound } from "next/navigation";
import VoyageDetailClient from "./VoyageDetailClient";

export const dynamic = "force-dynamic";

export default async function VoyageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const voyages = await getAllVoyages();
  const voyage = voyages.find((v) => v.slug === params.slug);
  if (!voyage) notFound();
  const galleryPhotos = (await getAllPhotos()).filter(
    (p) => p.voyageId === voyage.id
  );
  return <VoyageDetailClient voyage={voyage} galleryPhotos={galleryPhotos} />;
}
