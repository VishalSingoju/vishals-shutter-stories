'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SQUARE_DATA = [
  { id: 1, src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300' },
  { id: 2, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { id: 3, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300' },
  { id: 4, src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=300' },
  { id: 5, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300' },
  { id: 6, src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300' },
  { id: 7, src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300' },
  { id: 8, src: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300' },
  { id: 9, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=300' },
  { id: 10, src: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=300' },
  { id: 11, src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=300' },
  { id: 12, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300' },
  { id: 13, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=300' },
  { id: 14, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300' },
  { id: 15, src: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80&w=300' },
  { id: 16, src: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=300' },
];

const shuffle = (array: typeof SQUARE_DATA) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function CtaSection() {
  const [squares, setSquares] = useState(SQUARE_DATA);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = () => {
      setSquares(shuffle(SQUARE_DATA));
      timeoutRef.current = setTimeout(interval, 3200);
    };
    timeoutRef.current = setTimeout(interval, 3200);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="w-full bg-[#1C1917] px-8 py-24 text-[#FDFBF7]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <span className="block mb-3 text-xs font-semibold uppercase tracking-widest text-[#E07A5F]">
            Let's Collaborate
          </span>
          <h3 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
            Ready to frame your next chapter?
          </h3>
          <p className="my-6 text-base text-stone-400 font-light leading-relaxed">
            Whether you are planning an intimate wedding or looking for an honest editorial portrait session, let’s document moments you’ll revisit for decades.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-[#FDFBF7] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] transition-all hover:bg-[#E07A5F] hover:text-white active:scale-95"
          >
            Start a Conversation
          </Link>
        </div>

        {/* 4x4 Grid */}
        <div className="grid h-[420px] grid-cols-4 grid-rows-4 gap-2">
          {squares.map((sq) => (
            <motion.div
              key={sq.id}
              layout
              transition={{ duration: 1.2, type: 'spring' }}
              className="h-full w-full rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${sq.src})` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}