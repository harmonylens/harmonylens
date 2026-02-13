import rawData from "./photos.json";
import type { PhotosData, Photo } from "../types/photos";

const data = rawData as PhotosData;

export const allPhotos: Photo[] = data.photos;

export const events: string[] = Array.from(
  new Set(allPhotos.map((p) => p.event))
).sort();

export function photosByEvent(event: string): Photo[] {
  return allPhotos.filter((p) => p.event === event);
}

export function featuredPhotos(): Photo[] {
  const featured = allPhotos.filter((p) => p.featured);
  return featured.length ? featured : allPhotos; // fallback: alles
}
