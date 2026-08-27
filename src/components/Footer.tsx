import Link from "next/link";

// ─────────────────────────────────────────────────────────
// Minimal, quiet footer — dense masonry grids above should end
// on something calm, not another busy section. No Footer.css
// needed; everything comes from tailwind.config.ts tokens.
// ─────────────────────────────────────────────────────────

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Email", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
        <p className="font-display text-lg text-ink">Vishal&rsquo;s Shutter Stories</p>

        <nav className="flex gap-6 font-body text-sm text-graphite">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-body text-xs text-graphite">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}