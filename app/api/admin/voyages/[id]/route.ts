import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getVoyageById, updateVoyage, deleteVoyage } from "@/lib/voyages";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const voyage = getVoyageById(params.id);
  if (!voyage) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(voyage);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const voyage = updateVoyage(params.id, data);
    if (!voyage) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(voyage);
  } catch (err) {
    console.error("[PUT /api/admin/voyages]", err);
    return NextResponse.json({ error: "Erreur serveur — impossible de sauvegarder" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const ok = deleteVoyage(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/voyages]", err);
    return NextResponse.json({ error: "Erreur serveur — impossible de supprimer" }, { status: 500 });
  }
}
