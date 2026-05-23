import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getVoyageById } from "@/lib/voyages";
import VoyageForm from "../../VoyageForm";

export default async function EditVoyagePage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAuthenticated()) redirect("/admin/login");
  const voyage = await getVoyageById(params.id);
  if (!voyage) notFound();
  return <VoyageForm voyage={voyage} />;
}
