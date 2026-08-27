'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  description?: string;
  category?: string;
};

export default function MasonryGallery({ photos }: { photos: Photo[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<Photo | null>(null);

  // lock body scroll & Esc to close lightbox
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [active]);

  // fade-in on scroll
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(new Set(photos.map((_, i) => i)));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const idx = Number(e.target.getAttribute('data-index'));
              next.add(idx);
            }
          });
          return next;
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    const nodes = containerRef.current?.querySelectorAll('[data-index]');
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [photos.length]);

  return (
    <>
      <div className="max-w-content mx-auto px-6 md:px-12 py-12 md:py-18">
        <div ref={containerRef} className="columns-2 gap-2 md:columns-3 md:gap-3 lg:columns-4 [column-gap:16px] md:[column-gap:24px]">
          {photos.map((photo, i) => {
            const inView = visible.has(i);
            return (
              <div
                key={i}
                data-index={i}
                className="mb-2 break-inside-avoid md:mb-3 group cursor-pointer relative"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 600ms ease, transform 600ms ease',
                  transitionDelay: `${Math.min(i, 20) * 40}ms`,
                }}
                onClick={() => setActive(photo)}
              >
                <div className="overflow-hidden rounded relative">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-auto block transition-opacity duration-500 group-hover:opacity-60"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {(photo.title || photo.description || photo.category) && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {photo.title && <p className="text-white font-display text-sm">{photo.title}</p>}
                      {photo.category && <p className="text-white/80 text-xs uppercase tracking-wide">{photo.category}</p>}
                      {photo.description && <p className="text-white/80 text-xs mt-1 line-clamp-2">{photo.description}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          onClick={() => setActive(null)}
          aria-modal="true"
          role="dialog"
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 text-paper text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            onClick={(e) => { e.stopPropagation(); setActive(null); }}
          >
            ✕
          </button>
          <div className="relative max-w-[90vw] max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.src}
              alt={active.alt}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded shadow-2xl"
            />
            {(active.title || active.description || active.category) && (
              <div className="mt-3 text-center text-paper">
                {active.title && <p className="font-display text-lg">{active.title}</p>}
                {active.category && <p className="text-xs uppercase tracking-wide text-paper/80">{active.category}</p>}
                {active.description && <p className="text-sm text-paper/80 mt-1 max-w-2xl mx-auto">{active.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
