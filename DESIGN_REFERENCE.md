# Editorial Photography Portfolio Design System

A design specification for high-contrast, editorial photography portfolios and visual storytelling experiences.

---

## 1. Design Philosophy & Core Principles

* **Quiet Hero, Dense Gallery:** The hero section remains calm, spacious, and restrained—letting a single full-bleed image and oversized serif headline set the mood[cite: 3]. Visual density is reserved for the media gallery below, creating a rhythm between breathing room and rich content[cite: 3, 5].
* **System-Driven Restraint:** Every color value, spacing tier, and typographic step comes directly from a unified set of semantic tokens rather than arbitrary pixel sizes or hardcoded hex colors[cite: 3].
* **Native Flow Over JavaScript Layouts:** Media grids rely strictly on native multi-column flow instead of script-driven masonry engines, eliminating visual layout shifts and preserving native image optimization[cite: 5].
* **Uncompromising Accessibility:** Clear focus rings are mandatory across all interactive elements, and all motion automatically collapses for users requesting reduced motion[cite: 2].

---

## 2. Color Palette & Roles

* **Paper (Base Canvas):** A soft, tactile off-white used as the foundation across the entire interface, avoiding the harsh glare of pure digital white[cite: 2].
* **Ink (Primary Copy):** A deep, rich dark tone applied to headlines, body text, and structural links to maximize readability against the paper canvas[cite: 2, 3].
* **Graphite (Subdued Metadata):** A mid-tone gray reserved for category labels, timestamps, eyebrow accents, and contextual annotations[cite: 3].
* **Accent (Focus & Interaction):** A distinct high-visibility highlight color used strictly for interactive focus rings and active states to ensure navigation clarity[cite: 2].

---

## 3. Typography & Hierarchy

* **Display Serif:** 
  * **Role:** Primary headlines, section titles, and narrative emphasis (`h1`, `h2`, `h3`)[cite: 2].
  * **Style:** Expressive, optically sized editorial serif typefaces (such as Fraunces, GT Sectra, or Canela)[cite: 3, 4].
  * **Scale:** Oversized fluid scaling (`clamp`) that dynamically grows with the viewport without overflowing narrow screens[cite: 3].
* **Body Sans:** 
  * **Role:** Body text, captions, interactive controls, and UI elements[cite: 2, 4].
  * **Style:** Clean, geometric sans-serif (such as Inter) with high legibility across varied screen resolutions[cite: 2, 4].
* **Eyebrows & Microcopy:**
  * **Role:** Section prefixes, image details, and categories[cite: 3].
  * **Style:** Small text sizes, uppercase casing, and wide letter-spacing to distinguish metadata from reading copy[cite: 3].

---

## 4. Layout & Spacing Architecture

* **Multi-Column Masonry Flow:** 
  * Grid columns scale responsively from 2 columns on mobile devices up to 4 columns on large displays[cite: 5].
  * Elements use strict page-break avoidance so mixed portrait and landscape images fit together seamlessly without awkward gaps[cite: 5].
  * Spacing between images is intentionally tight to emphasize visual density[cite: 5].
* **Rhythmic Section Padding:** 
  * Main content blocks use generous vertical padding tiers (72px to 88px) to establish a relaxed editorial pace between dense visual sections[cite: 3].
* **Reading Constraints:** 
  * Narrative blocks and headings are bounded by a fixed maximum container width (around 72rem / 1152px) to keep line lengths comfortable and prevent edge-to-edge stretching[cite: 3].

---

## 5. Interaction, Motion & Accessibility

* **Visible Focus Outlines:** 
  * All focusable elements (links, buttons, interactive cards) present a prominent, offset outline using the accent color token upon keyboard focus[cite: 2].
* **Reduced Motion Compliance:** 
  * When reduced motion is requested at the operating system level, transitions and animations instantly collapse to near-zero duration[cite: 2].
* **Interactive Media Surfaces:** 
  * Thumbnails subtly reduce opacity on hover, offering immediate interactive feedback without dramatic transforms that disrupt the layout[cite: 5].
* **Modal Viewing Experience:** 
  * Lightbox previews use a darkened ink backdrop with background blur, allow keyboard dismissal (Escape), and preserve the native aspect ratios of previewed media.

---

## 6. Basic Layout – Current Implementation

### Root Layout
* `src/app/layout.tsx` – Loads Fraunces for display and Inter for body via `next/font/google`. Sets font CSS variables `--font-fraunces` / `--font-inter`. Global metadata and wraps app with `globals.css` tokens.

### Home Page – `src/app/page.tsx`
Composed of three sections:

#### Hero Section – `src/components/Hero.tsx`
* Quiet, spacious, restrained hero with single full-bleed image
* `h-[85vh] min-h-[560px] w-full` with `object-cover`
* Text block below image: `max-w-content px-6 py-18 md:px-12`
* Headline uses `text-display-xl` oversized fluid serif
* Optional eyebrow: `text-sm uppercase tracking-widest text-graphite`
* Currently rendered with `/assets/4.jpg` and headline "Vishal's Gallery"

#### Masonry Gallery – `src/components/MasonryGallery.tsx`
* Native CSS masonry: `columns-2 gap-2 md:columns-3 md:gap-3 lg:columns-4`
* `break-inside-avoid` to prevent awkward gaps
* Tight spacing to emphasize visual density
* Uses `next/image` with responsive `sizes`
* Photo data passed from page, currently stubbed

#### Footer – `src/components/Footer.tsx`
* Minimal quiet footer with `border-t border-hairline`
* `max-w-content` flex layout: brand left, nav center, copyright right
* Brand in `font-display text-lg text-ink`
* Nav links with `hover:text-accent`
* Social links currently placeholders

### Design Tokens – `src/app/globals.css`
Tailwind v4 `@theme`:
* Colors: `paper #fafaf8`, `ink #1a1a1a`, `graphite #5c5a55`, `hairline #e5e3de`, `accent #8b4b3b`
* Fonts: `--font-display`, `--font-body`
* Spacing: `18 = 4.5rem`, `22 = 5.5rem`
* Container: `--container-content: 1400px`
* Type scale: `--text-display-xl/lg/md` with clamp
* Base: `bg-paper text-ink font-body`, headings `font-display`, focus-visible accent ring, reduced motion media query

### API
* `src/app/api/ideas/route.ts` – POST endpoint to Supabase `ideas` table for idea submissions

### 404
* `src/app/not-found.tsx` – Client component interactive camera simulator 404. Currently uses inline styles and diverges from token system.

### Notes vs Spec
* Hero and Masonry follow Quiet Hero / Dense Gallery and Native Flow principles
* Tokens drive colors/typography/spacing
* Accessibility focus rings and reduced motion implemented
* Missing: thumbnail hover opacity, modal lightbox viewing experience, 404 diverges from token system, container width 1400px vs spec ~1152px
