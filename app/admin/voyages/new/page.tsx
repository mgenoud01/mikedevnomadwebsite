import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import VoyageForm from "../VoyageForm";

export default function NewVoyagePage() {
  if (!isAuthenticated()) redirect("/admin/login");
  return <VoyageForm />;
}
