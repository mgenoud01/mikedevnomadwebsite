import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/articles";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const a = await getArticleById(params.id);
    if (!a) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(a);
  } catch (err) {
    console.error("[GET /api/admin/articles/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const a = await updateArticle(params.id, data);
    if (!a) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(a);
  } catch (err) {
    console.error("[PUT /api/admin/articles/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const ok = await deleteArticle(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/articles/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
