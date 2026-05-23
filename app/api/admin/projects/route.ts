import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllProjects, createProject } from "@/lib/projects";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllProjects());
  } catch (err) {
    console.error("[GET /api/admin/projects]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const project = await createProject({
      titre: data.titre || "",
      description: data.description || "",
      stack: data.stack || [],
      lien: data.lien || "",
      github: data.github || "",
      image: data.image || "",
      featured: data.featured || false,
      status: data.status || "done",
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/projects]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
