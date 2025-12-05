import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TimetableProvider } from '@/contexts/TimetableContext';
import type { Metadata } from 'next';
import './globals.css';
import { siteInfo } from './siteInfo';

export const metadata = {
  metadataBase: new URL(siteInfo.url),
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
      <link rel="dns-prefetch" href={siteInfo.url} />
    </head>
    <body className="flex min-h-screen flex-col">
      <TimetableProvider>
        <Header title={siteInfo.title} description={siteInfo.description} />
        <main className="grow">{children}</main>
        <Footer title={siteInfo.title} description={siteInfo.description} />
      </TimetableProvider>
    </body>
  </html>
);

export default RootLayout;
