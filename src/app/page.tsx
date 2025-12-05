import { MainLayout } from '@/components/layout/MainLayout';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import type { CourseModel } from '@/types/course';
import type { SearchOptions } from '@/types/searchOptions';
import { courseSearchParamDefinitions, searchOptionsSchema } from '@/types/searchOptions';
import { parseSearchParams } from '@/utils/searchParams';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { siteInfo } from './siteInfo';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ share?: string }>;
}): Promise<Metadata> => {
  const isTwitterShare = (await searchParams).share === 'twitter';
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
    const db = getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
    return await db.select().from(courses).all();
  },
  ['course-data'],
  {
    // DB更新時に再検証するため、キャッシュの自動再検証は無効化
    revalidate: false,
    tags: ['courses'],
  },
);

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const courseData = await getCachedCourseData();
  const params = await searchParams;

  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    } else {
      urlSearchParams.set(key, value);
    }
  });

  const searchOptions: SearchOptions = parseSearchParams(
    urlSearchParams,
    courseSearchParamDefinitions,
    searchOptionsSchema,
  ).match(
    (value) => value,
    (error) => {
      console.warn('Failed to parse search params:', error);
      return {};
    },
  );

  return <MainLayout courses={courseData} searchOptions={searchOptions} />;
};

export default Home;
