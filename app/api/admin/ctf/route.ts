import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllCTF, createCTF } from "@/lib/ctf";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllCTF());
  } catch (err) {
    console.error("[GET /api/admin/ctf]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const entry = await createCTF({
      nom: data.nom || "",
      categorie: data.categorie || "",
      difficulte: data.difficulte || "Easy",
      plateforme: data.plateforme || "",
      date: data.date || "",
      description: data.description || "",
      writeup: data.writeup || "",
      tags: data.tags || [],
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/ctf]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
