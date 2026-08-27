'use client';
<meta name="strix-verification" content="strix-verify-8351a6541aa917ff2d714682a26ef1b5"></meta>

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Hero from "@/components/Hero";
import MasonryGallery from "@/components/MasonryGallery";
import Footer from "@/components/Footer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  description?: string;
  category?: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      const items = (data || []).map(p => ({
        src: p.img,
        alt: p.title,
        width: 1200,
        height: Number(p.height) || 1600,
        title: p.title,
        description: p.description || '',
        category: p.category || '',
      }));
      setPhotos(items);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <main>
      <Hero
        imageSrc="/assets/4.jpg"
        imageAlt="..."
        headline="Vishal's Gallery "
      />
      {!loading && photos.length > 0 && (
        <div className="max-w-content mx-auto px-6 md:px-12 pt-12 pb-6 text-center">
          <a href="/" className="font-display text-display-md text-ink hover:text-accent">
            Vishal's Photo Gallery
          </a>
        </div>
      )}
      {loading ? (
        <div className="max-w-content mx-auto px-6 py-18 text-graphite">Loading gallery...</div>
      ) : photos.length === 0 ? (
        <div className="max-w-content mx-auto px-6 py-18 text-graphite">
          <p className="font-display text-2xl mb-2">Gallery is empty</p>
          <p>Upload photos via the admin panel at <a href="/admin" className="underline hover:text-ink">/admin</a> to see them here.</p>
        </div>
      ) : (
        <MasonryGallery photos={photos} />
      )}
      <Footer />
    </main>
  );
}
