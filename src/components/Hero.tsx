'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    // Inverted Cursor Tracker
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Entrance Animation Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.7'
      )
      .fromTo(
        tilesRef.current?.children || [],
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.15 },
        '-=0.6'
      );

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-[#FAF7F2] text-[#1C1917] pt-24"
    >
      {/* Inverted Blend Follower */}
      <div
        ref={cursorRef}
        className="pointer-events-none absolute -left-12 -top-12 z-30 h-28 w-28 rounded-full bg-white mix-blend-difference blur-[0.5px] hidden md:block"
        style={{ willChange: 'transform' }}
      />

      <div className="max-w-5xl text-center relative z-20">
        <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#C4623D] font-semibold mb-6">
          Documentary & Editorial Photography
        </span>

        <h1
          ref={titleRef}
          className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight"
        >
          Preserving <span className="italic font-light">raw human emotion</span> in timeless light.
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 max-w-xl mx-auto text-base sm:text-lg text-stone-600 font-light leading-relaxed"
        >
          Observational patience learned in wildlife, brought into candid weddings and editorial portraits. Honest, unmanipulated moments over rigid staging.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="#gallery"
            className="flex items-center gap-2 rounded-full bg-[#1C1917] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-transform hover:scale-105 active:scale-95"
          >
            Explore Archive <ArrowDownRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#1C1917]/20 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#1C1917] transition-all hover:bg-[#1C1917]/5"
          >
            Inquire
          </Link>
        </div>
      </div>

      {/* Floating Accent Story Tiles */}
      <div ref={tilesRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {/* Wildlife Pillar */}
        <div
          className="absolute left-[6%] top-[22%] h-44 w-32 md:h-56 md:w-40 rounded-2xl bg-cover bg-center shadow-2xl -rotate-6 border border-white/50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=600)' }}
        />
        {/* Weddings Pillar */}
        <div
          className="absolute right-[6%] top-[18%] h-48 w-36 md:h-64 md:w-48 rounded-2xl bg-cover bg-center shadow-2xl rotate-6 border border-white/50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600)' }}
        />
        {/* People Pillar */}
        <div
          className="absolute bottom-[8%] left-[12%] h-36 w-28 md:h-48 md:w-36 rounded-2xl bg-cover bg-center shadow-2xl 3 rotate-3 border border-white/50"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600)' }}
        />
      </div>
    </section>
  );
}