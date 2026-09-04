'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { X, MapPin, Sparkles } from 'lucide-react';

export interface GalleryItem {
  id: string;
  img: string;
  title: string;
  category: 'People' | 'Weddings' | 'Wildlife';
  location: string;
  description: string;
}

export default function MasonryGallery({ items }: { items: GalleryItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.gallery-card');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  }, [items]);

  return (
    <div id="gallery" className="w-full max-w-7xl mx-auto px-6 py-16">
      <div
        ref={gridRef}
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="gallery-card break-inside-avoid overflow-hidden rounded-2xl bg-[#EFECE6] cursor-pointer shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group"
            onClick={() => setActiveItem(item)}
          >
            <HoverCard openDelay={100} closeDelay={150}>
              <HoverCardTrigger asChild>
                <div className="relative w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C4623D]">
                      {item.category}
                    </span>
                    <h3 className="text-white text-base font-editorial font-normal">{item.title}</h3>
                  </div>
                </div>
              </HoverCardTrigger>

              <HoverCardContent
                side="top"
                className="w-72 rounded-xl bg-[#1C1917]/95 backdrop-blur-md p-4 text-[#FAF7F2] border border-white/10 shadow-2xl z-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C4623D]">
                    {item.category}
                  </span>
                  <Sparkles size={13} className="text-[#C4623D]" />
                </div>
                <h4 className="font-editorial text-base font-normal mt-1">{item.title}</h4>
                <p className="mt-1 text-xs text-stone-300 font-light leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-400">
                  <MapPin size={12} />
                  <span>{item.location}</span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-[#1C1917] p-6 text-[#FAF7F2] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute right-5 top-5 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={activeItem.img}
              alt={activeItem.title}
              className="max-h-[65vh] w-full rounded-xl object-contain bg-black/30"
            />
            <div className="mt-5 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C4623D]">
                {activeItem.category} • {activeItem.location}
              </span>
              <h2 className="font-editorial text-2xl font-light mt-1">{activeItem.title}</h2>
              <p className="mt-2 text-sm text-stone-300 font-light leading-relaxed">
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}