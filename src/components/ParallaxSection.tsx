'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export default function ParallaxSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = parallaxRef.current;
    if (!container) return;

    const layers = container.querySelectorAll('[data-parallax-depth]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    layers.forEach((layer) => {
      const depth = Number(layer.getAttribute('data-parallax-depth')) || 20;
      tl.to(layer, { yPercent: depth, ease: 'none' }, 0);
    });

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(layers);
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={parallaxRef}
      className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-[#1C1917] px-6 py-24 text-[#FDFBF7]"
    >
      <div
        data-parallax-depth="-30"
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-110 pointer-events-none"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600)' }}
      />

      <div data-parallax-depth="25" className="relative z-10 max-w-3xl text-center">
        <span className="text-xs font-semibold tracking-widest text-[#E07A5F] uppercase">
          Linen & Light
        </span>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl font-light italic leading-tight">
          "Patience learned in the wild; honesty preserved in the moment."
        </h2>
        <p className="mt-6 text-stone-400 font-light leading-relaxed">
          The instincts honed tracking unpredictable birds outside my window translated naturally into catching fleeting, genuine glances between people. No stiff poses. No forced scripts.
        </p>
      </div>
    </section>
  );
}