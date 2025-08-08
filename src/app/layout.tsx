import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TimetableProvider } from '@/contexts/TimetableContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

const siteInfo = {
  title: 'SyllaHub',
  description: 'INIADシラバス検索非公式サイト',
  url: 'https://syllahub.imoken27.workers.dev/',
} as const;

export const metadata = {
  metadataBase: new URL(siteInfo.url),
  title: siteInfo.title,
  description: siteInfo.description,
  keywords: ['INIAD', 'シラバス', '検索', '東洋大学', '情報連携学部', '授業', '時間割'],
  authors: [{ name: 'imoken777', url: 'https://github.com/imoken777' }],
  robots: 'index, follow',
  openGraph: {
    title: siteInfo.title,
    description: siteInfo.description,
    locale: 'ja_JP',
    type: 'website',
    siteName: siteInfo.title,
    images: [
      {
        url: '/syllahub-logo.png',
        width: 1200,
        height: 630,
        alt: 'SyllaHub ロゴ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteInfo.title,
    description: siteInfo.description,
  },
} as const satisfies Metadata;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ja">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={siteInfo.url} />
    </head>
    <body className={`${inter.className} flex min-h-screen flex-col`}>
      <TimetableProvider>
        <Header title={siteInfo.title} description={siteInfo.description} />
        <main className="grow">{children}</main>
        <Footer title={siteInfo.title} description={siteInfo.description} />
      </TimetableProvider>
    </body>
  </html>
);

export default RootLayout;
