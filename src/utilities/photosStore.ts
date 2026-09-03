import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'photos.json');

export type Photo = {
  id: string;
  img: string;
  title?: string;
  description?: string;
  category?: string;
  height?: number;
};

function readPhotos(): Photo[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writePhotos(photos: Photo[]) {
  fs.writeFileSync(filePath, JSON.stringify(photos, null, 2));
}

export function getPhotos(): Photo[] {
  return readPhotos();
}

export function addPhoto(p: Photo) {
  const photos = readPhotos();
  photos.unshift(p);
  writePhotos(photos);
}

export function removePhoto(id: string) {
  const photos = readPhotos();
  writePhotos(photos.filter((p) => p.id !== id));
}