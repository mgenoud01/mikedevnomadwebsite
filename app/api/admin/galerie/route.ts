import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllPhotos, createPhoto } from "@/lib/galerie";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllPhotos());
  } catch (err) {
    console.error("[GET /api/admin/galerie]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const photo = await createPhoto({
      url: data.url || "",
      titre: data.titre || "",
      lieu: data.lieu || "",
      pays: data.pays || "",
      description: data.description || "",
      miseEnAvant: data.miseEnAvant || false,
      voyageId: data.voyageId,
    });
    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/galerie]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
