import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', color: 'var(--accent)', lineHeight: 1 }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '16px 0 8px' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}
