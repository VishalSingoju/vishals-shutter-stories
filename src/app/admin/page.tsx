'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Photo {
  id: string;
  img: string;
  title: string;
  category: string;
  height: number;
}

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Landscape');

  // Load existing photos
  const loadPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Helper: auto-detect natural image height for masonry
  const getImageDimensions = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(Math.round((img.naturalHeight / img.naturalWidth) * 400));
      img.onerror = () => resolve(400); // fallback
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    setLoading(true);
    const computedHeight = await getImageDimensions(imageUrl);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          img: imageUrl,
          title,
          category,
          height: computedHeight,
        }),
      });

      if (res.ok) {
        setImageUrl('');
        setTitle('');
        loadPhotos();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    await fetch(`/api/photos?id=${id}`, { method: 'DELETE' });
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Admin Studio</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Upload Form */}
        <div className="md:col-span-1 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Add New Story
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Image URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:outline-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Golden Hour in Hyderabad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:outline-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:outline-black"
              >
                <option value="Landscape">Landscape</option>
                <option value="Portraits">Portraits</option>
                <option value="Street">Street</option>
                <option value="Weddings">Weddings</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish to Gallery'}
            </button>
          </form>
        </div>

        {/* Existing Photos List */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Live Gallery Items ({photos.length})
          </h2>

          {fetching ? (
            <div className="py-12 flex justify-center text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-neutral-200">
                  <img src={photo.img} alt={photo.title} className="w-full h-36 object-cover" />
                  <div className="p-2.5 bg-white">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{photo.title}</p>
                    <p className="text-[10px] text-neutral-500 uppercase">{photo.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 text-red-600 shadow hover:bg-red-50 transition"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}