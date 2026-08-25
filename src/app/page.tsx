'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MasonryGallery, { MasonryItem } from '@/components/MasonryGallery';


const SHUTTER_STORIES: MasonryItem[] = [
  { id: '1', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1400', height: 450, title: 'Mountain Silence', category: 'Landscape' },
  { id: '2', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1400', height: 300, title: 'Golden Hour Portrait', category: 'Portraits' },
  { id: '3', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400', height: 520, title: 'The Vows', category: 'Weddings' },
  { id: '4', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1400', height: 350, title: 'Mist & Valley', category: 'Landscape' },
  { id: '5', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1400', height: 480, title: 'First Dance', category: 'Weddings' },
  { id: '6', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1400', height: 280, title: 'Studio Monologue', category: 'Portraits' },
];

export default function Home() {
  const [filter, setFilter] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);

  const filteredItems = filter === 'All'
    ? SHUTTER_STORIES
    : SHUTTER_STORIES.filter(item => item.category === filter);

  // Close modal on 'Escape' key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedItem(null);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, handleKeyDown]);

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12 md:px-16 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 text-xs font-semibold tracking-widest uppercase mb-1">
              
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
              Gallery
            </h1>
          </div>

          {/* Filter Bar & Re-animate */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Landscape', 'Portraits', 'Weddings'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  filter === cat
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 border-transparent hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black border border-neutral-200 transition-colors ml-2"
              title="Re-run animation"
            >
             
            </button>
          </div>
        </div>

        {/* Gallery Component */}
        <MasonryGallery
          key={refreshKey}
          items={filteredItems}
          animateFrom="bottom"
          blurToFocus={true}
          stagger={0.06}
          scaleOnHover={true}
          hoverScale={0.97}
          colorShiftOnHover={false}
          gap={20}
          onItemClick={(item) => setSelectedItem(item)}
        />
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-md transition-all duration-300 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.img}
              alt={selectedItem.title || 'Portfolio Image'}
              className="max-h-[75vh] w-auto object-contain select-none"
            />
            
            {(selectedItem.title || selectedItem.category) && (
              <div className="w-full px-6 py-4 bg-neutral-950/95 flex items-center justify-between border-t border-neutral-850">
                <div>
                  {selectedItem.category && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                      {selectedItem.category}
                    </span>
                  )}
                  {selectedItem.title && (
                    <h3 className="text-base font-semibold text-white">
                      {selectedItem.title}
                    </h3>
                  )}
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  Press ESC or click outside to close
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}