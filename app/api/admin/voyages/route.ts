import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getAllVoyages, createVoyage, slugify } from "@/lib/voyages";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllVoyages());
  } catch (err) {
    console.error("[GET /api/admin/voyages]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const voyage = await createVoyage({
      titre: data.titre || "",
      slug: slugify(data.titre || ""),
      pays: data.pays || "",
      emoji: data.emoji || "🌍",
      dateDebut: data.dateDebut || "",
      dateFin: data.dateFin || "",
      resume: data.resume || "",
      photoCouverture: data.photoCouverture || "",
      restos: data.restos || [],
      endroits: data.endroits || [],
      galerie: data.galerie || [],
      conseils: data.conseils || [],
      hashtags: data.hashtags || [],
      budgetJour: data.budgetJour || 0,
      contenu: data.contenu || "",
      miseEnAvant: data.miseEnAvant || false,
    });
    revalidatePath("/nomade");
    revalidatePath("/nomade/voyages");
    return NextResponse.json(voyage, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/voyages]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
