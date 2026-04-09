import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllPhotos, createPhoto } from "@/lib/galerie";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(getAllPhotos());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await req.json();
  const photo = createPhoto({
    url: data.url || "",
    titre: data.titre || "",
    lieu: data.lieu || "",
    pays: data.pays || "",
    description: data.description || "",
    miseEnAvant: data.miseEnAvant || false,
  });
  return NextResponse.json(photo, { status: 201 });
}
