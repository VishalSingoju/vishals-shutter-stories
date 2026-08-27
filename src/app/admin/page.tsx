'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Photo = {
  name: string;
  id: string;
  updated_at: string;
  publicUrl: string;
};

export default function AdminPage() {
  const [files, setFiles] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadFiles = async () => {
    const { data, error } = await supabase.storage.from('photos').list('uploads', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'updated_at', order: 'desc' },
    });
    if (error) {
      setMessage('Error loading files: ' + error.message);
      return;
    }
    const withUrls = (data || []).map(f => ({
      name: f.name,
      id: f.id,
      updated_at: f.updated_at,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/photos/uploads/${f.name}`,
    }));
    setFiles(withUrls);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    if (!file) return;
    setUploading(true);
    setMessage('');
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('photos').upload(`uploads/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(false);
    if (error) {
      setMessage('Upload error: ' + error.message);
      return;
    }
    setMessage('Uploaded successfully');
    loadFiles();
    formRef.current?.reset();
  };

  const handleDelete = async (name: string) => {
    const { error } = await supabase.storage.from('photos').remove([`uploads/${name}`]);
    if (error) {
      setMessage('Delete error: ' + error.message);
      return;
    }
    setMessage('Deleted');
    loadFiles();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-paper text-ink p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-display-lg">Admin – Photo Management</h1>
        {user ? (
          <button onClick={handleLogout} className="px-4 py-2 border border-hairline rounded hover:bg-ink hover:text-paper">
            Logout
          </button>
        ) : (
          <a href="/login" className="px-4 py-2 border border-hairline rounded hover:bg-ink hover:text-paper">
            Login
          </a>
        )}
      </div>

      <section className="mb-8">
        <h2 className="font-display text-2xl mb-3">Upload new photo</h2>
        <form ref={formRef} onSubmit={handleUpload} className="flex gap-3 items-end">
          <input name="file" type="file" accept="image/*" required />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-ink text-paper rounded"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {message && <p className="mt-2 text-graphite">{message}</p>}
      </section>

      <section>
        <h2 className="font-display text-2xl mb-3">Existing photos</h2>
        {files.length === 0 ? (
          <p className="text-graphite">No photos found in bucket `photos/uploads`</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map(f => (
              <div key={f.name} className="border border-hairline rounded p-2">
                <img src={f.publicUrl} alt={f.name} className="w-full h-40 object-cover rounded mb-2" />
                <p className="text-xs text-graphite truncate">{f.name}</p>
                <button
                  onClick={() => handleDelete(f.name)}
                  className="mt-2 text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl mb-3">Site Content</h2>
        <p className="text-graphite">Hero headline and gallery order management coming soon.</p>
      </section>
    </main>
  );
}
