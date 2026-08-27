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
      </div>

      {/* Calm, restrained text block — the dense grid does the "busy" work
          elsewhere on the page, so the hero stays quiet and lets one
          strong image + oversized serif type carry it */}
      <div className="mx-auto max-w-content px-6 py-18 md:px-12">
        {eyebrow && (
          <p className="mb-3 font-body text-sm uppercase tracking-widest text-graphite">
            {eyebrow}
          </p>
        )}
        <h1 className="text-display-xl text-ink">{headline}</h1>
      </div>
    </section>
  );
}
