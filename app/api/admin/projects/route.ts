import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllProjects, createProject } from "@/lib/projects";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(getAllProjects());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const data = await req.json();
  const project = createProject({
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
}
