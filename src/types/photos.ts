export type Photo = {
  id: string;
  event: string;
  src: string;
  featured: boolean;
};

export type PhotosData = {
  photos: Photo[];
};