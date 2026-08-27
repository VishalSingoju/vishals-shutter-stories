import Image from "next/image";

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
