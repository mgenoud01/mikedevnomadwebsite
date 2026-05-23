import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllArticles, createArticle, slugify } from "@/lib/articles";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(await getAllArticles());
  } catch (err) {
    console.error("[GET /api/admin/articles]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = await req.json();
    const article = await createArticle({
      titre: data.titre || "",
      slug: slugify(data.titre || ""),
      categorie: data.categorie || "Nomadisme",
      date: data.date || new Date().toISOString().split("T")[0],
      resume: data.resume || "",
      photoCouverture: data.photoCouverture || "",
      contenu: data.contenu || "",
      tags: data.tags || [],
      publie: data.publie ?? true,
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/articles]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
