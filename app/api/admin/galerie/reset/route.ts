import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { writeData } from "@/lib/storage";

/** POST /api/admin/galerie/reset — vide complètement la galerie dans le blob */
export async function POST() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    await writeData("galerie", "galerie.json", []);
    revalidatePath("/nomade/galerie");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
