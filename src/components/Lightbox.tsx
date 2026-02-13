import { useEffect, useRef, useState } from "react";
import type { Photo } from "../types/photos";

type Props = {
  photos: Photo[];
  index: number;
  onRequestClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({
  photos,
  index,
  onRequestClose,
  onPrev,
  onNext,
}: Props) {
  const photo = photos[index];

  // anim state
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

  // swipe refs
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const startT = useRef(0);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    window.setTimeout(() => onRequestClose(), 200);
  };

  // keyboard + scroll lock + open animation
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);

    const raf = requestAnimationFrame(() => setOpen(true));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!photo) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    lastX.current = t.clientX;
    lastY.current = t.clientY;
    startT.current = Date.now();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    lastX.current = t.clientX;
    lastY.current = t.clientY;
  };

  const onTouchEnd = () => {
    const dx = lastX.current - startX.current;
    const dy = lastY.current - startY.current;
    const dt = Math.max(1, Date.now() - startT.current);

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const distanceOK = absX > 60;
    const mostlyHorizontal = absX > absY * 1.2;
    const velocity = absX / dt;
    const velocityOK = velocity > 0.25;

    if (mostlyHorizontal && (distanceOK || velocityOK)) {
      if (dx < 0) onNext();
      else onPrev();
      return;
    }

    const downClose = dy > 90 && absY > absX;
    if (downClose) requestClose();
  };

  return (
    <div
      className={[
        "fixed inset-0 z-[999] backdrop-blur-sm transition-opacity duration-200",
        open ? "bg-black/80 opacity-100" : "bg-black/80 opacity-0",
      ].join(" ")}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* top bar */}
      <div
        className={[
          "absolute top-0 left-0 right-0 flex items-center justify-between p-4 transition-all duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        ].join(" ")}
      >
        <div className="text-white/80 text-xs">
          {index + 1} / {photos.length}
        </div>

        <button
          onClick={requestClose}
          className="text-white/90 hover:text-white text-sm px-3 py-2 rounded-md bg-white/10 hover:bg-white/15"
        >
          Sluiten
        </button>
      </div>

      {/* nav buttons */}
      <button
        onClick={onPrev}
        aria-label="Vorige"
        className={[
          "absolute left-3 top-1/2 -translate-y-1/2 text-white px-4 py-3 rounded-full",
          "bg-white/10 hover:bg-white/15 transition-all duration-200",
          open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
        ].join(" ")}
      >
        ←
      </button>

      <button
        onClick={onNext}
        aria-label="Volgende"
        className={[
          "absolute right-3 top-1/2 -translate-y-1/2 text-white px-4 py-3 rounded-full",
          "bg-white/10 hover:bg-white/15 transition-all duration-200",
          open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
        ].join(" ")}
      >
        →
      </button>

      {/* image */}
      <div className="w-full h-full flex items-center justify-center p-6 sm:p-10">
        <img
          src={photo.src}
          alt=""
          className={[
            "max-h-full max-w-full object-contain select-none",
            "transition-all duration-200 ease-out",
            open ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
          ].join(" ")}
          draggable={false}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>

      {/* mobile hint */}
      <div
        className={[
          "absolute bottom-4 left-0 right-0 flex justify-center text-xs text-white/60 transition-opacity duration-200 sm:hidden",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        Swipe ← → om te bladeren
      </div>
    </div>
  );
}
