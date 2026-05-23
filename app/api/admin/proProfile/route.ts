import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProProfile, saveProProfile } from "@/lib/proProfile";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getProProfile());
  } catch (err) {
    console.error("[GET /api/admin/proProfile]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const profile = await saveProProfile({
      bio: data.bio || "",
      disponible: data.disponible ?? true,
      yearsExp: data.yearsExp || 0,
      projectsShipped: data.projectsShipped || 0,
      ctfPodiums: data.ctfPodiums || 0,
      email: data.email || "",
      github: data.github || "",
      linkedin: data.linkedin || "",
      skills: data.skills || [],
    });
    return NextResponse.json(profile);
  } catch (err) {
    console.error("[PUT /api/admin/proProfile]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
