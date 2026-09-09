'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold">500 - Application Error</h1>
          <p className="text-slate-400 text-sm">
            An unexpected error occurred on the server. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
