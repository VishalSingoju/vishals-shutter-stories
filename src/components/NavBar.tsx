'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#gallery", label: "Gallery" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About Me" },
    { href: "/contact", label: "Contact Me" },
  ];

  return (
    <>
      <header className="w-full border-b border-hairline bg-paper">
        <div className="max-w-content mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded border border-hairline"
          >
            <div className="w-6 h-0.5 bg-ink mb-1" />
            <div className="w-6 h-0.5 bg-ink mb-1" />
            <div className="w-6 h-0.5 bg-ink" />
          </button>

          <Link href="/" className="font-display text-xl text-ink">
            Vishal's Shutter Stories
          </Link>

          <nav className="hidden md:flex gap-6 text-graphite">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className={`md:hidden fixed left-0 top-0 h-full w-64 bg-paper border-r border-hairline z-40 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 pt-20">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                ✕
              </button>
              <h2 className="font-display text-2xl mb-6">Menu</h2>
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-ink hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
