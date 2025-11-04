import { MainLayout } from '@/components/layout/MainLayout';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import type { CourseModel } from '@/types/course';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { siteInfo } from './siteInfo';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: { share?: string };
}): Promise<Metadata> => {
  const isTwitterShare = searchParams.share === 'twitter';
  if (isTwitterShare) {
    return {};
  }

  return {
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
};

const getCachedCourseData = unstable_cache(
  async (): Promise<CourseModel[]> => {
    const db = await getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
    return await db.select().from(courses).all();
  },
  ['course-data'],
  {
    // DB更新時に再検証するため、キャッシュの自動再検証は無効化
    revalidate: false,
    tags: ['courses'],
  },
);

const Home = async () => {
  const courseData = await getCachedCourseData();

  return <MainLayout courses={courseData} />;
};

export default Home;
