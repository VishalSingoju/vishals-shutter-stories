'use client';
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import MasonryGallery from '@/components/MasonryGallery';
import Footer from '@/components/Footer';

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
      try {
        const res = await fetch('/api/photos');
        const list = await res.json();
        const mapped = list.map((p: any) => ({
          src: p.img,
          alt: p.title || 'Photo',
          width: 1200,
          height: Number(p.height) || 1600,
          title: p.title,
          description: p.description,
          category: p.category,
        }));
        setPhotos(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main>
      <Hero imageSrc="/assets/4.jpg" imageAlt="..." headline="Vishal's Gallery" />

      {!loading && photos.length > 0 && (
        <div className="max-w-content mx-auto px-6 md:px-12 pt-12 pb-6 text-center">
          <a href="/" className="font-display text-display-md text-ink hover:text-accent">
            Vishal's Photo Gallery
          </a>
        </div>
      )}

      {/* 👇 Gallery section – note the id="gallery" */}
      <section id="gallery">
        {loading ? (
          <div className="max-w-content mx-auto px-6 py-18 text-graphite">Loading gallery...</div>
        ) : photos.length === 0 ? (
          <div className="max-w-content mx-auto px-6 py-18 text-graphite">
            <p className="font-display text-2xl mb-2">Gallery is empty</p>
            <p>Photos will appear here once added.</p>
          </div>
        ) : (
          <MasonryGallery photos={photos} />
        )}
      </section>

      <Footer />
    </main>
  );
}