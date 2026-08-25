'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ArrowLeft, Image as ImageIcon, Loader2, Plus, LogOut, Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Photo {
  id: string;
  img: string;
  title: string;
  category: string;
  height: number;
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Landscape');
  const [uploading, setUploading] = useState(false);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadPhotos = async () => {
    setFetchingPhotos(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingPhotos(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadPhotos();
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setLoginError(error.message);
    } else {
      setSession(data.session);
    }
    setSubmittingLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const calculateNaturalHeight = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const ratioHeight = Math.round((img.naturalHeight / img.naturalWidth) * 400);
        URL.revokeObjectURL(url);
        resolve(ratioHeight);
      };
      img.onerror = () => resolve(400);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image file to upload.');
      return;
    }

    setUploading(true);

    try {
      const computedHeight = await calculateNaturalHeight(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (storageError) throw storageError;

      const { data: publicData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('photos').insert([
        {
          img: publicData.publicUrl,
          title: title.trim() || 'Untitled Story',
          category,
          height: computedHeight,
        },
      ]);

      if (dbError) throw dbError;

      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      loadPhotos();
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imgUrl: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const urlParts = imgUrl.split('/photos/');
      if (urlParts.length > 1) {
        const pathInBucket = urlParts[1];
        await supabase.storage.from('photos').remove([pathInBucket]);
      }

      const { error } = await supabase.from('photos').delete().eq('id', id);
      if (error) throw error;

      setPhotos(photos.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-neutral-50 text-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Gallery
            </Link>
            <ShieldCheck className="w-5 h-5 text-neutral-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 mb-1">
            Admin Verification
          </h1>
          <p className="text-xs text-neutral-500 mb-6">
            Sign in with your Supabase Admin account to manage stories.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-neutral-300 focus:outline-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-neutral-300 focus:outline-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full py-3 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-16 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Gallery
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
            Admin Studio
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black rounded-lg border border-neutral-200 hover:bg-neutral-50 transition"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload New Photo
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Image File
              </label>
              <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl p-4 cursor-pointer hover:border-black transition bg-white overflow-hidden min-h-[140px]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-36 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto text-neutral-400 mb-1" />
                    <span className="text-xs text-neutral-500 font-medium">Click to select image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Hyderabad Monoliths"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:outline-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-neutral-300 bg-white focus:outline-black cursor-pointer"
              >
                <option value="Landscape">Landscape</option>
                <option value="Portraits">Portraits</option>
                <option value="Street">Street</option>
                <option value="Weddings">Weddings</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Supabase...
                </>
              ) : (
                'Upload & Publish'
              )}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Published Photos ({photos.length})
          </h2>

          {fetchingPhotos ? (
            <div className="py-20 flex justify-center text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-200 rounded-2xl text-center text-xs text-neutral-400">
              No photos uploaded yet. Select an image file to upload.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-sm"
                >
                  <img
                    src={photo.img}
                    alt={photo.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {photo.title}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      {photo.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id, photo.img)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 text-red-600 shadow hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}