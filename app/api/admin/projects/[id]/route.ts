import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProjectById, updateProject, deleteProject } from "@/lib/projects";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const project = await getProjectById(params.id);
    if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/admin/projects/:id]", err);
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
    const project = await updateProject(params.id, data);
    if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("[PUT /api/admin/projects/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const ok = await deleteProject(params.id);
    if (!ok) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/projects/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
