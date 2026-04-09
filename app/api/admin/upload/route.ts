import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

const CLOUD_NAME = "dpauopuut";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "mikedevnomad";

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const folder = (formData.get("folder") as string) || "mikedevnomad/voyages";

  const cloudForm = new FormData();
  cloudForm.append("file", file);
  cloudForm.append("upload_preset", UPLOAD_PRESET);
  cloudForm.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: cloudForm }
  );

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.error?.message || "Erreur Cloudinary" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ url: data.secure_url });
}
