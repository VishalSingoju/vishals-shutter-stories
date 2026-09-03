import { NextResponse } from 'next/server';

// Photos data with Cloudinary URLs
// TODO: Replace these placeholder URLs with your actual Cloudinary image URLs
let photos = [
  { id: '1', img: 'https://res.cloudinary.com/dqzlgkrrq/image/upload/v1788455543/main-sample.png', height: 450, title: 'Mountain Silence', category: 'Landscape' },
  { id: '2', img: 'https://res.cloudinary.com/dqzlgkrrq/image/upload/v1752101362/IMG_4178_x183k1.jpg', height: 300, title: 'Symmetrical Beauty', category: 'Portraits' },
  
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

    photos.unshift(newPhoto);

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