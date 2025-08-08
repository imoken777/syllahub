import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyResult } from '@/components/model/course/EmptyResult';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '@/lib/envValues';
import type { CourseModel } from '@/types/course';
import { unstable_cache } from 'next/cache';

const getCachedCourseData = unstable_cache(
  async (): Promise<CourseModel[]> => {
    const db = await getDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
    return await db.select().from(courses).all();
  },
  ['course-data'],
  {
    revalidate: 3600,
    tags: ['courses'],
  },
);

const Home = async () => {
  const courseData = await getCachedCourseData();
  if (courseData.length === 0) return <EmptyResult />;

  return <MainLayout courses={courseData} />;
};

export default Home;
