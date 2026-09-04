import Hero from '@/components/Hero';
import ParallaxSection from '@/components/ParallaxSection';
import MasonryGallery, { GalleryItem } from '@/components/MasonryGallery';
import Testimonials from '@/components/Testimonials';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

const ARCHIVE_ITEMS: GalleryItem[] = [
  {
    id: '1',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    title: 'The Unscripted Vows',
    category: 'Weddings',
    location: 'Hyderabad',
    description: 'Natural light documentary capture amidst customary vows. Unmanipulated ceremony emotions.',
  },
  {
    id: '2',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    title: 'Daylight Portraiture',
    category: 'People',
    location: 'Secunderabad',
    description: 'Fine art portrait study focused on raw presence without heavy artificial flash or rigid direction.',
  },
  {
    id: '3',
    img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=800',
    title: 'Dawn Vigil',
    category: 'Wildlife',
    location: 'Telangana',
    description: 'Split-second shutter reflexes and patient observation in early morning light.',
  },
  {
    id: '4',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    title: 'Heirloom Tones',
    category: 'Weddings',
    location: 'Hyderabad',
    description: 'Documentary celebration preserved with tactile, warm linen textures.',
  },
  {
    id: '5',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    title: 'The Silent Meadow',
    category: 'Wildlife',
    location: 'Western Ghats',
    description: 'Documenting fleeting animal movements with quiet environmental discipline.',
  },
  {
    id: '6',
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    title: 'Unposed Expression',
    category: 'People',
    location: 'Hyderabad',
    description: 'Editorial portraiture honoring genuine character and authentic emotion.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <Hero />
      <ParallaxSection />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C4623D]">
            Selected Works
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal mt-3">
            Stories Captured in Natural Rhythm
          </h2>
        </div>
        <MasonryGallery items={ARCHIVE_ITEMS} />
      </section>
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}