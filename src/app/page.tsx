import { MainLayout } from '@/components/layout/MainLayout';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import type { Metadata } from 'next';
import { siteInfo } from './siteInfo';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: siteInfo.title,
  description: siteInfo.description,
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
};

const Home = async () => {
  const db = getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
  const courseData = await db.select().from(courses).all();

  return <MainLayout courses={courseData} />;
};

export default Home;
