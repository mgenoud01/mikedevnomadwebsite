import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "galerie.json");

export interface Photo {
  id: string;
  url: string;
  titre: string;
  lieu: string;
  pays: string;
  description: string;
  miseEnAvant: boolean;
  voyageId?: string;
  createdAt: string;
}

export function getAllPhotos(): Photo[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function getPhotoById(id: string): Photo | null {
  return getAllPhotos().find((p) => p.id === id) || null;
}

function save(photos: Photo[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(photos, null, 2));
}

export function createPhoto(data: Omit<Photo, "id" | "createdAt">): Photo {
  const photos = getAllPhotos();
  const photo: Photo = { ...data, id: `photo_${Date.now()}`, createdAt: new Date().toISOString() };
  photos.unshift(photo);
  save(photos);
  return photo;
}

export function updatePhoto(id: string, data: Partial<Photo>): Photo | null {
  const photos = getAllPhotos();
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  photos[idx] = { ...photos[idx], ...data };
  save(photos);
  return photos[idx];
}

export function deletePhoto(id: string): boolean {
  const photos = getAllPhotos();
  const filtered = photos.filter((p) => p.id !== id);
  if (filtered.length === photos.length) return false;
  save(filtered);
  return true;
}
