'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '1rem'
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
            Application error
          </p>
          <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', opacity: 0.75 }}>
            Restart the dev server and clear the .next cache if this keeps happening.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.625rem',
              border: 'none',
              backgroundColor: '#00d9ff',
              color: '#020617',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
