import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/articles";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const a = getArticleById(params.id);
  if (!a) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(a);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await req.json();
  const a = updateArticle(params.id, data);
  if (!a) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(a);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const ok = deleteArticle(params.id);
  if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
