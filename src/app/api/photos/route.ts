import { NextResponse } from 'next/server';

// Temporary in-memory / state store (replace with Supabase, Prisma, or Mongo in production)
let photos = [
  { id: '1', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1400', height: 450, title: 'Mountain Silence', category: 'Landscape' },
  { id: '2', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1400', height: 300, title: 'Golden Hour Portrait', category: 'Portraits' },
  { id: '3', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400', height: 520, title: 'The Vows', category: 'Weddings' },
];

export async function GET() {
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { img, title, category, height } = body;

    if (!img) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const newPhoto = {
      id: Date.now().toString(),
      img,
      title: title || 'Untitled Story',
      category: category || 'Landscape',
      height: height || 400,
    };

    photos.unshift(newPhoto); // Add to the beginning of the list

    return NextResponse.json({ success: true, photo: newPhoto }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  photos = photos.filter(p => p.id !== id);
  return NextResponse.json({ success: true });
}