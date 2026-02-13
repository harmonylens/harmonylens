import { useCallback, useMemo, useState } from "react";
import type { Photo } from "../types/photos";
import Lightbox from "./Lightbox";

export default function Masonry({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // kleine guard: als photos verandert (bv andere event), sluit lightbox
  const safePhotos = useMemo(() => photos ?? [], [photos]);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return null;
      return (i - 1 + safePhotos.length) % safePhotos.length;
    });
  }, [safePhotos.length]);

  const next = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return null;
      return (i + 1) % safePhotos.length;
    });
  }, [safePhotos.length]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {safePhotos.map((p, idx) => (
          <figure key={p.id} className="mb-6 break-inside-avoid">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => setOpenIndex(idx)}
              aria-label="Open foto"
            >
              <img
                src={`${import.meta.env.BASE_URL}${p.src.replace(/^\//, "")}`}
                alt=""
                //w-full h-auto block cursor-pointer rounded-lg object-cover hover:brightness-95 transition
                className="w-full h-auto block cursor-pointer"
                loading="lazy"
              />
            </button>
          </figure>
        ))}
      </div>

{openIndex !== null && safePhotos.length > 0 && (
  <Lightbox
    photos={safePhotos}
    index={openIndex}
    onRequestClose={close}
    onPrev={prev}
    onNext={next}
  />
)}
    </div>
  );
}
