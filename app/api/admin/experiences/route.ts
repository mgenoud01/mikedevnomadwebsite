import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getAllExperiences, createExperience } from "@/lib/experience";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllExperiences());
  } catch (err) {
    console.error("[GET /api/admin/experiences]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const experience = await createExperience({
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
    revalidatePath("/pro");
    revalidatePath("/pro/cv");
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/experiences]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
