import Image from "next/image";

// ─────────────────────────────────────────────────────────
// WORKED EXAMPLE: this is what "rebuilding a borrowed component
// against your tokens" actually looks like in practice.
//
// If you copied a hero from another site, it probably had:
//   - hardcoded hex colors        → replaced with bg-paper / text-ink
//   - a px-based font-size        → replaced with text-display-xl
//   - its own spacing values      → replaced with the 8px scale (py-22, gap-8)
//   - maybe a different font      → uses font-display (Fraunces) here
//
// KEEP: the structural idea (full-bleed image + overlaid heading)
// DROP: every literal value that isn't coming from tailwind.config.ts
// ─────────────────────────────────────────────────────────

type HeroProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string; // small label above headline — omit if content isn't sequential/dated
  headline: string;
};

export default function Hero({ imageSrc, imageAlt, eyebrow, headline }: HeroProps) {
  return (
    <section className="relative w-full">
      <div className="relative h-[85vh] min-h-[560px] w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" aria-hidden />
        {/* Text overlaid on image, centered */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="mx-auto max-w-content px-6">
            {eyebrow && (
              <p className="mb-3 font-body text-sm uppercase tracking-widest text-white/80 drop-shadow">
                {eyebrow}
              </p>
            )}
            <h1 className="text-display-xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {headline}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
