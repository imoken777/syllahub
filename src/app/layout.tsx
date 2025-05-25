import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://syllahub.pages.dev/'),
  openGraph: {
    title: 'SyllaHub',
    description: 'INIADシラバス検索非公式サイト',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/syllahub-logo.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyllaHub',
    description: 'INIADシラバス検索非公式サイト',
  },
} as const satisfies Metadata;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className={`${inter.className} flex min-h-screen flex-col`}>
      <Header title={metadata.openGraph.title} description={metadata.openGraph.description} />
      <main className="grow">{children}</main>
      <Footer title={metadata.openGraph.title} description={metadata.openGraph.description} />
    </body>
  </html>
);

export default RootLayout;
