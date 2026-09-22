# Vishal's Shutter Stories

Static HTML/CSS/JavaScript photography portfolio built from the Vishal's Shutter Stories Brand Identity and TRD.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- Web3Forms for the contact form
- Optional Cloudinary for production image delivery
- GitHub + Vercel/Netlify/GitHub Pages for hosting

No React, Next.js, TypeScript, Tailwind, database, CMS, authentication, ecommerce or custom backend is required.

## Project structure

```text
vishals-shutter-stories/
├── index.html
├── portraits.html
├── weddings.html
├── wildlife.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── gallery.js
│   └── contact.js
├── assets/
│   ├── images/
│   │   ├── portraits/
│   │   ├── weddings/
│   │   └── wildlife/
│   └── icons/
├── favicon.ico
└── README.md
```

## Add your photographs

Put your WebP images into the matching folders using these filenames:

### Portraits
- hero.webp
- about.webp
- portrait-01.webp
- portrait-02.webp
- portrait-03.webp
- portrait-04.webp
- portrait-05.webp
- portrait-06.webp

### Weddings
- wedding-01.webp
- wedding-02.webp
- wedding-03.webp
- wedding-04.webp
- wedding-05.webp
- wedding-06.webp

### Wildlife
- wildlife-01.webp
- wildlife-02.webp
- wildlife-03.webp
- wildlife-04.webp
- wildlife-05.webp
- wildlife-06.webp

The HTML includes width/height attributes to reduce layout shift. Keep those values accurate for your actual image dimensions.

## Contact form

1. Create a Web3Forms access key.
2. Open `contact.html`.
3. Replace:

```html
YOUR_WEB3FORMS_ACCESS_KEY
```

with your access key.

The form validates required fields and email format before submitting.

## Cloudinary

The TRD specifies Cloudinary + WebP + responsive image delivery for production. The current version uses local WebP paths so the project works immediately as a static site.

When your image library is ready, replace the local `src` values in `index.html` and `js/gallery.js` with Cloudinary URLs using automatic format/quality and width transformations.

Recommended Cloudinary transformation pattern:

```text
/f_auto,q_auto,w_1200/
```

Do not commit private API secrets to this repository. A Cloudinary delivery URL is normally public; upload/admin credentials are not.

## Local testing

Because the site is static, you can open `index.html` directly for basic layout work.

For a better local development experience, use VS Code Live Server or another simple static HTTP server.

## Deployment

### Vercel
Import the GitHub repository into Vercel. No build command is required. Set the output to the project root.

### Netlify
Drag the project folder into Netlify Drop or connect the GitHub repository.

### GitHub Pages
Enable Pages for the repository and deploy from the main branch/root.

## TRD coverage

- 6 pages
- Static hero, no carousel
- Portrait / wedding / wildlife galleries
- Responsive image grids
- Lightbox
- Mobile sticky-style CTA through repeated availability CTAs
- About narrative
- Contact fields from FR-12
- Client-side validation
- Web3Forms integration
- Accessible navigation and image alt text
- Responsive 375px+ layout
- Lazy-loaded gallery images
- No authentication, ecommerce, blog, analytics dashboard or custom backend
