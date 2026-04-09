import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getVoyageById } from "@/lib/voyages";
import VoyageForm from "../../VoyageForm";

export default function EditVoyagePage({ params }: { params: { id: string } }) {
  if (!isAuthenticated()) redirect("/admin/login");
  const voyage = getVoyageById(params.id);
  if (!voyage) notFound();
  return <VoyageForm voyage={voyage} />;
}
