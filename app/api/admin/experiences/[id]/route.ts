import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { updateExperience, deleteExperience } from "@/lib/experience";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const experience = await updateExperience(params.id, data);
    if (!experience) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/pro");
    revalidatePath("/pro/cv");
    return NextResponse.json(experience);
  } catch (err) {
    console.error("[PUT /api/admin/experiences/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const ok = await deleteExperience(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/pro");
    revalidatePath("/pro/cv");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/experiences/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
