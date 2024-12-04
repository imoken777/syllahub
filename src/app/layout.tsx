import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const title = 'SiilaHub';
const description = 'INIADのシラバスを簡単に検索できる非公式サイト';

export const metadata: Metadata = {
  title,
  description,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className={inter.className}>
      <Header title={title} description={description} />
      <main>{children}</main>
      <Footer title={title} description={description} />
    </body>
  </html>
);

export default RootLayout;
