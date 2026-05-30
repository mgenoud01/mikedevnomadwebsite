/**
 * Upload direct depuis le navigateur vers Cloudinary.
 * Bypass la serverless function Vercel (limite ~4.5 MB) — pas de limite côté client.
 * Le cloud name et l'upload preset unsigned sont publics par nature.
 */
const CLOUD_NAME = "dpauopuut";
const UPLOAD_PRESET = "mikedevnomad";

export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Cloudinary error ${res.status}`);
  }
  return data.secure_url as string;
}
