import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getAllPhotos } from "@/lib/galerie";
import { writeData } from "@/lib/storage";
import type { Photo } from "@/lib/galerie";

/**
 * POST /api/admin/galerie/batch
 * Sauvegarde plusieurs photos en une seule opération (1 lecture + 1 écriture blob).
 * Évite les race conditions des uploads individuels séquentiels.
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { photos: newPhotosData } = await req.json() as {
      photos: Array<{
        url: string;
        titre: string;
        lieu?: string;
        pays?: string;
        description?: string;
        miseEnAvant?: boolean;
        voyageId?: string;
      }>;
    };

    if (!Array.isArray(newPhotosData) || newPhotosData.length === 0) {
      return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
    }

    // 1 seule lecture du blob
    const existing = await getAllPhotos();

    // Créer toutes les nouvelles photos avec des IDs uniques
    const now = Date.now();
    const created: Photo[] = newPhotosData.map((data, i) => ({
      url: data.url,
      titre: data.titre || "",
      lieu: data.lieu || "",
      pays: data.pays || "",
      description: data.description || "",
      miseEnAvant: data.miseEnAvant || false,
      voyageId: data.voyageId,
      id: `photo_${now}_${i}`,
      createdAt: new Date().toISOString(),
    }));

    // 1 seule écriture du blob avec toutes les photos
    await writeData("galerie", "galerie.json", [...created, ...existing]);

    revalidatePath("/nomade/galerie");
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/galerie/batch]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
