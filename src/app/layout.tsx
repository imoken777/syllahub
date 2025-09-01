import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TimetableProvider } from '@/contexts/TimetableContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteInfo } from './siteInfo';

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

export const metadata = {
  metadataBase: new URL(siteInfo.url),
  title: siteInfo.title,
  description: siteInfo.description,
  keywords: ['INIAD', 'シラバス', '検索', '東洋大学', '情報連携学部', '授業', '時間割'],
  authors: [{ name: 'imoken777', url: 'https://github.com/imoken777' }],
  robots: 'index, follow',
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
