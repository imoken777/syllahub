import { IndexContainer } from '@/components/layout/IndexContainer';
import { courses } from '@/drizzle/schema';
import { getDb } from '@/lib/db';
import type { CourseModel } from '@/types/course';

const Home = async () => {
  const db = await getDb();
  const courseData: CourseModel[] = await db.select().from(courses).all();
  if (courseData.length === 0) return <div>データがありません</div>;

  return <IndexContainer courses={courseData} />;
};
export default Home;
