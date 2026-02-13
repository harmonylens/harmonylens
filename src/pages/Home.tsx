// import rawData from "../data/photos.json";
import Masonry from "../components/Masonry";
// import type { PhotosData } from "../types/photos";
import { featuredPhotos } from "../data/photos";

// const data = rawData as PhotosData;

export default function Home() {
  // const featured = data.photos.filter((p) => p.featured);
  // const photosToShow = featured.length ? featured : data.photos;

  return <Masonry photos={featuredPhotos()} />;
}
