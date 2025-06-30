import { IndexContainer } from '@/components/layout/IndexContainer';
import { EmptyResult } from '@/components/model/course/EmptyResult';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import type { CourseModel } from '@/types/course';
import { unstable_cache } from 'next/cache';

const getCachedCourseData = unstable_cache(
  async (): Promise<CourseModel[]> => {
    const db = await getDb();
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

  return <IndexContainer courses={courseData} />;
};

export default Home;
