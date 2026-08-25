// src/pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
}