import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProjectById, updateProject, deleteProject } from "@/lib/projects";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const project = getProjectById(params.id);
  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await req.json();
  const project = updateProject(params.id, data);
  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const ok = deleteProject(params.id);
  if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
