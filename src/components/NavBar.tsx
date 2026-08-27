'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Left Burger Button - visible on all screens */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="fixed left-4 top-4 z-50 p-2 rounded border border-hairline bg-paper"
      >
        <div className="w-6 h-0.5 bg-ink mb-1" />
        <div className="w-6 h-0.5 bg-ink mb-1" />
        <div className="w-6 h-0.5 bg-ink" />
      </button>

      {/* Left Slide Menu */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-paper border-r border-hairline z-40 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h2 className="font-display text-2xl mb-6">Menu</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)} className="text-ink hover:text-accent">
              Home
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)} className="text-ink hover:text-accent">
              Admin
            </Link>
          </nav>
        </div>
      </div>

      {/* Normal Top Navigation Bar */}
      <header className="w-full border-b border-hairline bg-paper">
        <div className="max-w-content mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-display text-xl text-ink">
            Vishal's Shutter Stories
          </Link>
          <nav className="hidden md:flex gap-6 text-graphite">
            <Link href="/" className="hover:text-ink">Home</Link>
            <Link href="/admin" className="hover:text-ink">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
