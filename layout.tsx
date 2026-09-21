import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const display = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Dola, wrapped.',
  description: 'A very specific gift for a very specific person.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#121113',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink font-sans text-bone antialiased">{children}</body>
    </html>
  );
}
