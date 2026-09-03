import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { addPhoto, removePhoto as removeStoredPhoto } from '@/utilities/photosStore';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  // basic auth guard – token is sent as `Authorization: Bearer ...`
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file') as File | null;
  const title = form.get('title') as string | null;
  const description = form.get('description') as string | null;

  if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 });

  const buffer = await file.arrayBuffer();

  // Upload to Cloudinary – we use the raw buffer to avoid another HTTP round‑trip
  const result = await cloudinary.uploader.upload_stream(
    {
      folder: 'vishal-gallery',
      use_filename: true,
      public_id: `photo-${Date.now()}`,
    },
    async (err, uploadResult) => {
      if (err || !uploadResult) {
        throw err ?? new Error('Cloudinary upload failed');
      }
      const newPhoto = {
        id: Date.now().toString(),
        img: uploadResult.secure_url,
        title: title ?? '',
        description: description ?? '',
        category: 'Uploaded',
        height: 400,
      };
      addPhoto(newPhoto);
    }
  );

  result.end(Buffer.from(buffer));

  return NextResponse.json({ message: 'Uploaded', status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  removePhoto(id);
  return NextResponse.json({ success: true });
}

function removePhoto(id: string) {
  removeStoredPhoto(id);
}
