'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-8">
      <form onSubmit={handleLogin} className="w-full max-w-sm border border-hairline rounded p-6 bg-paper">
        <h1 className="font-display text-3xl mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <label className="block mb-3">
          <span className="text-sm text-graphite">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full mt-1 border border-hairline rounded px-3 py-2"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-graphite">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full mt-1 border border-hairline rounded px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-ink text-paper rounded disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
