import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateCTF, deleteCTF } from "@/lib/ctf";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const entry = await updateCTF(params.id, data);
    if (!entry) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(entry);
  } catch (err) {
    console.error("[PUT /api/admin/ctf/:id]", err);
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
    const ok = await deleteCTF(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/ctf/:id]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
