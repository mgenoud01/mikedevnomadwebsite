import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { updatePhoto, deletePhoto } from "@/lib/galerie";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const p = await updatePhoto(params.id, data);
    if (!p) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/nomade/galerie");
    return NextResponse.json(p);
  } catch (err) {
    console.error("[PUT /api/admin/galerie/:id]", err);
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
    const ok = await deletePhoto(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/nomade/galerie");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/galerie/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
