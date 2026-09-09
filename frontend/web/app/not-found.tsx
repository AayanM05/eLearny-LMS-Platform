'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold text-2xl mb-4">
        <GraduationCap className="w-6 h-6" />
      </div>
      <h1 className="text-4xl font-display font-extrabold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        The learning module or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-lg shadow transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
