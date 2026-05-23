import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { writeData } from "@/lib/storage";
import type { Photo } from "@/lib/galerie";

/**
 * POST /api/admin/galerie/batch
 *
 * Le client envoie :
 *   - newPhotos    : les nouvelles photos à ajouter (URLs Cloudinary)
 *   - keepPhotos   : les photos déjà en place (état React du client)
 *
 * On fait 0 lecture du blob — on écrit directement [newPhotos + keepPhotos].
 * Évite la race condition "read stale → overwrite real data".
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await req.json() as {
      newPhotos: Array<{
        url: string;
        titre: string;
        lieu?: string;
        pays?: string;
        description?: string;
        miseEnAvant?: boolean;
        voyageId?: string;
      }>;
      keepPhotos: Photo[];
    };

    if (!Array.isArray(body.newPhotos) || body.newPhotos.length === 0) {
      return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
    }

    const keepPhotos: Photo[] = Array.isArray(body.keepPhotos) ? body.keepPhotos : [];

    const now = Date.now();
    const created: Photo[] = body.newPhotos.map((data, i) => ({
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

    // Écriture directe — 0 lecture du blob, 0 risque d'écraser des données
    await writeData("galerie", "galerie.json", [...created, ...keepPhotos]);

    revalidatePath("/nomade/galerie");
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/galerie/batch]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
