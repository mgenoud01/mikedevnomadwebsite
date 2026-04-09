import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateExperience, deleteExperience } from "@/lib/experience";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await req.json();
  const experience = updateExperience(params.id, data);
  if (!experience) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(experience);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const ok = deleteExperience(params.id);
  if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
