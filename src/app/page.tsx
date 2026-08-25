'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MasonryGallery, { MasonryItem } from '@/components/MasonryGallery';
import { RefreshCw, X, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MasonryItem | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setItems(data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const filteredItems = filter === 'All'
    ? items
    : items.filter(item => item.category === filter);

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
              Gallery of Stories
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Landscape', 'Portraits', 'Weddings', 'Street', 'Architecture'].map(cat => (
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
              onClick={() => {
                fetchPhotos();
                setRefreshKey(k => k + 1);
              }}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black border border-neutral-200 transition-colors ml-1"
              title="Refresh & Re-animate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              className="p-2 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 border border-neutral-200 transition-colors"
              title="Admin Login & Studio"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="py-24 flex justify-center text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredItems.length > 0 ? (
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
        ) : (
          <div className="py-20 text-center text-neutral-400 text-sm">
            No photos found in this category. Visit{' '}
            <Link href="/admin" className="text-black font-semibold underline">
              Admin
            </Link>{' '}
            to upload stories.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-md transition-all duration-300 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

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
              <div className="w-full px-6 py-4 bg-neutral-950/95 flex items-center justify-between border-t border-neutral-800">
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