'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type DbPhoto = {
  id: string;
  created_at: string;
  img: string;
  title: string;
  description?: string | null;
  category: string;
  height: number | null;
};

export default function AdminPage() {
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) router.replace('/login');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  const loadPhotos = async () => {
    const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (error) { setMessage('Error loading: ' + error.message); return; }
    setPhotos(data || []);
  };

  useEffect(() => { loadPhotos(); }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get('file') as File;
    const title = String(fd.get('title') || '');
    const description = String(fd.get('description') || '');

    if (!file || !title) { setMessage('File and Title are required'); return; }

    setUploading(true);
    setMessage('');

    const fileName = `${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('photos').upload(`uploads/${fileName}`, file);
    if (upErr) { setUploading(false); setMessage('Upload error: ' + upErr.message); return; }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/photos/uploads/${fileName}`;

    const { error: dbErr } = await supabase.from('photos').insert({
      img: publicUrl,
      title,
      description,
      height: 400,
    });

    setUploading(false);
    if (dbErr) { setMessage('DB error: ' + dbErr.message); return; }

    setMessage('Uploaded and saved');
    e.currentTarget.reset();
    // Reload to refresh gallery and clear form state
    window.location.reload();
  };

  const handleDelete = async (id: string, imgUrl: string) => {
    const { error: dbErr } = await supabase.from('photos').delete().eq('id', id);
    if (dbErr) { setMessage('Delete error: ' + dbErr.message); return; }
    const filePath = imgUrl.split('/uploads/')[1];
    if (filePath) await supabase.storage.from('photos').remove([`uploads/${filePath}`]);
    setMessage('Deleted');
    loadPhotos();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="max-w-content mx-auto px-6 py-18 md:py-22">
        <header className="flex justify-between items-start mb-16">
          <div>
            <p className="text-sm uppercase tracking-widest text-graphite mb-3">Admin</p>
            <h1 className="font-display text-display-lg">Photo Management</h1>
          </div>
          {user && (
            <button onClick={handleLogout} className="mt-2 px-4 py-2 border border-hairline rounded hover:bg-ink hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Logout
            </button>
          )}
        </header>

        <section className="mb-18">
          <h2 className="font-display text-display-md mb-6">Upload new photo</h2>
          <div className="border border-hairline rounded p-6 bg-paper relative">
            {uploading && (
              <div className="absolute inset-0 bg-paper/80 backdrop-blur-sm flex items-center justify-center z-10 rounded">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="font-display">Uploading... please wait</p>
                </div>
              </div>
            )}
            <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col md:col-span-2">
                <span className="text-sm text-graphite mb-2 uppercase tracking-wide">File *</span>
                <input name="file" type="file" accept="image/*" required className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-hairline file:rounded file:bg-paper file:text-ink hover:file:bg-ink hover:file:text-paper" />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-graphite mb-2 uppercase tracking-wide">Title *</span>
                <input name="title" type="text" required className="border border-hairline rounded px-3 py-2" />
              </label>
              <label className="flex flex-col md:col-span-2">
                <span className="text-sm text-graphite mb-2 uppercase tracking-wide">Description</span>
                <textarea name="description" rows={3} className="border border-hairline rounded px-3 py-2" />
              </label>
              <div className="md:col-span-2 flex justify-center">
                <button disabled={uploading} className="px-5 py-2.5 bg-ink text-paper rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload & Save'}
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-graphite text-sm">{message}</p>}
          </div>
        </section>

        <section>
          <h2 className="font-display text-display-md mb-6">Existing photos</h2>
          {photos.length === 0 ? (
            <p className="text-graphite">No photos in database.</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map(p => (
                <div key={p.id} className="break-inside-avoid border border-hairline rounded p-3 bg-paper">
                  <img src={p.img} alt={p.title} className="w-full h-auto rounded mb-3" />
                  <p className="text-sm font-display">{p.title}</p>
                  {p.description && <p className="text-xs text-graphite mb-1">{p.description}</p>}
                  <button onClick={() => handleDelete(p.id, p.img)} className="mt-2 text-xs underline text-ink hover:text-accent">Delete</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
