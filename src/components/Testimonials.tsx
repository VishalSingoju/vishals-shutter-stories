'use client';

import React from 'react';

const REVIEWS = [
  {
    quote: "Vishal captured raw, unscripted glances that we didn't even notice happened during our wedding ceremony.",
    client: "Aditi & Rohan",
    location: "Hyderabad",
  },
  {
    quote: "His patience and understanding of natural light produced portraits that feel like fine art rather than studio setups.",
    client: "Siddharth N.",
    location: "Secunderabad",
  },
  {
    quote: "Completely unobtrusive. The documentary lens preserved genuine human memories that feel heirloom grade.",
    client: "Pooja V.",
    location: "Gachibowli",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-[#FDFBF7] py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#E07A5F]">
          Client Stories
        </span>
        <h3 className="font-serif text-3xl md:text-4xl font-light text-[#1C1917] mt-2">
          Unstaged Words & Memories
        </h3>
      </div>

      {/* Marquee with Alpha Mask */}
      <div
        className="flex w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div className="flex shrink-0 gap-6 animate-marquee py-4">
          {[...REVIEWS, ...REVIEWS].map((item, i) => (
            <div
              key={i}
              className="w-80 sm:w-96 shrink-0 rounded-2xl bg-white p-8 shadow-sm border border-stone-100 flex flex-col justify-between"
            >
              <p className="text-sm text-stone-700 font-light leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-[#1C1917]">{item.client}</h4>
                <p className="text-xs text-stone-400">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}