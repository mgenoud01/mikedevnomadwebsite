import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAllArticles, createArticle, slugify } from "@/lib/articles";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(getAllArticles());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await req.json();
  const article = createArticle({
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
}
