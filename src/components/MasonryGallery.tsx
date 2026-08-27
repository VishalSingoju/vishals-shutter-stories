import Image from "next/image";

// ─────────────────────────────────────────────────────────
// Pure CSS masonry (columns + break-inside-avoid) — no JS library.
// This is the single most common failure point in borrowed masonry
// code: JS-measured masonry libraries (react-masonry-css, Isotope,
// Masonry.js) fight Next's Image component and cause layout shift
// on load. CSS columns don't, and they handle mixed aspect ratios
// (portrait + landscape shots) natively — which matters a lot for
// a "tight, dense" grid where gaps read as mistakes.
// ─────────────────────────────────────────────────────────

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function MasonryGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-2 gap-2 px-6 md:columns-3 md:gap-3 md:px-12 lg:columns-4">
      {photos.map((photo, i) => (
        <div key={i} className="mb-2 break-inside-avoid md:mb-3">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="w-full"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
