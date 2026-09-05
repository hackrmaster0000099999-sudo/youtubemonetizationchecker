import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/constants/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `YouTube Tools & Monetization Checker | ${SITE_NAME}`,
  description:
    'Free YouTube tools to check monetization signals, find channel IDs, estimate earnings, download thumbnails, extract tags, and explore YouTube data.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `YouTube Tools & Monetization Checker | ${SITE_NAME}`,
    description:
      'Free YouTube tools to check monetization signals, find channel IDs, estimate earnings, download thumbnails, extract tags, and explore YouTube data.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `YouTube Tools & Monetization Checker | ${SITE_NAME}`,
    description:
      'Free YouTube tools to check monetization signals, find channel IDs, estimate earnings, download thumbnails, extract tags, and explore YouTube data.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/logo.png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FCFCFB] text-[#16181C]" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

