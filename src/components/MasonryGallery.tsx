'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MasonryItem {
  id: string | number;
  img: string;
  url?: string;
  height: number;
  title?: string;
  category?: string;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MasonryGalleryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  gap?: number;
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: MasonryItem) => void;
}

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQueryLists = queries.map(q => window.matchMedia(q));
    const getValue = () => {
      const matchIndex = mediaQueryLists.findIndex(mql => mql.matches);
      return matchIndex !== -1 ? values[matchIndex] : defaultValue;
    };
    setValue(getValue());
    const handler = () => setValue(getValue());
    mediaQueryLists.forEach(mql => mql.addEventListener('change', handler));
    return () => mediaQueryLists.forEach(mql => mql.removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = true,
  colorShiftOnHover = false,
  gap = 20,
  className,
  itemClassName,
  onItemClick,
}) => {
  const columns = useMedia(
    ['(min-width: 1536px)', '(min-width: 1024px)', '(min-width: 640px)'],
    [4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, containerHeight } = useMemo(() => {
    if (!width || width === 0) return { grid: [] as GridItem[], containerHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    const gridItems: GridItem[] = items.map(item => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = (item.height / 400) * columnWidth;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...item, x, y, w: columnWidth, h: height };
    });

    return { grid: gridItems, containerHeight: Math.max(...colHeights) };
  }, [columns, items, width, gap]);

  const getInitialPosition = useCallback(
    (item: GridItem) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { x: item.x, y: item.y };

      let direction = animateFrom;
      if (animateFrom === 'random') {
        const dirs: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
        direction = dirs[Math.floor(Math.random() * dirs.length)];
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -250 };
        case 'bottom':
          return { x: item.x, y: typeof window !== 'undefined' ? window.innerHeight + 250 : 600 };
        case 'left':
          return { x: -300, y: item.y };
        case 'right':
          return { x: typeof window !== 'undefined' ? window.innerWidth + 300 : 1200, y: item.y };
        case 'center':
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 120 };
      }
    },
    [animateFrom, containerRef]
  );

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    grid.forEach((item, index) => {
      const element = itemRefs.current.get(item.id);
      if (!element) return;

      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(16px)' }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 1.0,
            ease,
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(element, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });

    if (grid.length > 0) hasMounted.current = true;
  }, [grid, imagesReady, stagger, blurToFocus, duration, ease, getInitialPosition]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{ height: containerHeight || 'auto', minHeight: '300px' }}
    >
      {grid.map(item => (
        <div
          key={item.id}
          ref={el => {
            if (el) itemRefs.current.set(item.id, el);
            else itemRefs.current.delete(item.id);
          }}
          className={cn(
            'group absolute overflow-hidden cursor-pointer rounded-2xl bg-neutral-100 border border-neutral-200/80 transition-shadow hover:shadow-xl will-change-transform',
            itemClassName
          )}
          onClick={() => {
            if (onItemClick) onItemClick(item);
            else if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
          }}
          onMouseEnter={e => {
            if (scaleOnHover) gsap.to(e.currentTarget, { scale: hoverScale, duration: 0.35, ease: 'power2.out' });
          }}
          onMouseLeave={e => {
            if (scaleOnHover) gsap.to(e.currentTarget, { scale: 1, duration: 0.35, ease: 'power2.out' });
          }}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${item.img})` }}
          />

          {colorShiftOnHover && (
            <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}

          {(item.title || item.category) && (
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end translate-y-2 group-hover:translate-y-0">
              {item.category && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-300 mb-1">
                  {item.category}
                </span>
              )}
              {item.title && (
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {item.title}
                </h3>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MasonryGallery;