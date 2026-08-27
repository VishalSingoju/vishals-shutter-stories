import Hero from "@/components/Hero";
import MasonryGallery from "@/components/MasonryGallery";
import Footer from "@/components/Footer";

const photos = [
  { src: "/assets/4.jpg", alt: "Beautiful", width: 1200, height: 1600 },
  { src: "/assets/Hero.jpg", alt: "Bird", width: 1200, height: 1600 },

  // ...rest of your images
];

export default function Home() {
  return (
    <main>
      <Hero
        imageSrc="/assets/4.jpg"
        imageAlt="..."
        headline="Vishal's Gallery "
      />
      <MasonryGallery photos={photos} />
      <Footer />
    </main>
  );
}
