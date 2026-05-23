import { readData, writeData } from "./storage";

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

export async function getAllPhotos(): Promise<Photo[]> {
  return readData<Photo[]>("galerie", "galerie.json", []);
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const photos = await getAllPhotos();
  return photos.find((p) => p.id === id) || null;
}

async function save(photos: Photo[]): Promise<void> {
  await writeData("galerie", "galerie.json", photos);
}

export async function createPhoto(
  data: Omit<Photo, "id" | "createdAt">
): Promise<Photo> {
  const photos = await getAllPhotos();
  const photo: Photo = {
    ...data,
    id: `photo_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  photos.unshift(photo);
  await save(photos);
  return photo;
}

export async function updatePhoto(
  id: string,
  data: Partial<Photo>
): Promise<Photo | null> {
  const photos = await getAllPhotos();
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  photos[idx] = { ...photos[idx], ...data };
  await save(photos);
  return photos[idx];
}

export async function deletePhoto(id: string): Promise<boolean> {
  const photos = await getAllPhotos();
  const filtered = photos.filter((p) => p.id !== id);
  if (filtered.length === photos.length) return false;
  await save(filtered);
  return true;
}
