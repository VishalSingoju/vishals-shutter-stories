// Migration script to copy all photos from Supabase storage to Cloudinary
// Run with: ts-node scripts/migrate-supabase-to-cloudinary.ts

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function migrate() {
  const { data: photos, error } = await supabase.from('photos').select('*');
  if (error) {
    console.error('Supabase query error:', error);
    return;
  }

  for (const photo of photos!) {
    const supabaseUrl = photo.img;
    if (!supabaseUrl) continue;
    try {
      // Download image
      const res = await fetch(supabaseUrl);
      const buffer = await res.buffer();
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream({ folder: 'vishal-gallery' }, (error, data) => {
        if (error) throw error;
        console.log('Uploaded', data.secure_url);
      });
      // Wait for stream to finish
      const stream = cloudinary.uploader.upload_stream({ folder: 'vishal-gallery' });
      stream.end(buffer);
    } catch (e) {
      console.error('Failed for', supabaseUrl, e);
    }
  }
}

migrate().catch(console.error);
