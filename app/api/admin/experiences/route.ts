import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllExperiences, createExperience } from "@/lib/experience";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(getAllExperiences());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const data = await req.json();
  const experience = createExperience({
    entreprise: data.entreprise || "",
    poste: data.poste || "",
    dateDebut: data.dateDebut || "",
    dateFin: data.dateFin || "",
    lieu: data.lieu || "",
    description: data.description || "",
    competences: data.competences || [],
    actuel: data.actuel || false,
    type: data.type || "work",
  });

  return NextResponse.json(experience, { status: 201 });
}
