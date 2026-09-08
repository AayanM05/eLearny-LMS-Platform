import React from 'react';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'eLearny — LMS Platform',
  description: 'Full-scale Learning Management System Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
