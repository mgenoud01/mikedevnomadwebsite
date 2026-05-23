import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getVoyageById, updateVoyage, deleteVoyage } from "@/lib/voyages";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const voyage = await getVoyageById(params.id);
    if (!voyage) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(voyage);
  } catch (err) {
    console.error("[GET /api/admin/voyages/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const voyage = await updateVoyage(params.id, data);
    if (!voyage) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/nomade");
    revalidatePath("/nomade/voyages");
    revalidatePath(`/nomade/voyages/${voyage.slug}`);
    return NextResponse.json(voyage);
  } catch (err) {
    console.error("[PUT /api/admin/voyages/:id]", err);
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
    const ok = await deleteVoyage(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    revalidatePath("/nomade");
    revalidatePath("/nomade/voyages");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/voyages/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
