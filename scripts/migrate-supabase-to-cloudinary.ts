import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

// Supabase credentials (keep the same as in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function migrate() {
  // 1️⃣ Grab all photos from Supabase
  const { data: rawPhotos, error } = await supabase
    .from('photos')
    .select('*');

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  if (!Array.isArray(rawPhotos)) {
    console.error('Unexpected data shape.');
    return;
  }

  // 2️⃣ Process each photo
  for (const photo of rawPhotos) {
    const supabaseUrl = photo.img;

    if (!supabaseUrl) continue;

    try {
      // Cloudinary can re‑upload directly from a public URL
      const uploadResult = await cloudinary.uploader.upload(supabaseUrl, {
        folder: 'vishal-gallery',
        use_filename: true,
        public_id: `photo-${photo.id}-${Date.now()}`,
      });

      console.log(
        `✅ Migrated photo ${photo.id} → ${uploadResult.secure_url}`
      );
      /* 👉 Copy that URL and paste it into your `public/photos.json` (or update `/api/photos/route.ts` directly). */
    } catch (err: any) {
      console.error(`Error migrating photo ${photo.id}:`, err.message);
    }
  }
}