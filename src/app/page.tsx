import { IndexContainer } from '@/components/layout/IndexContainer';
import { courses } from '@/drizzle/schema';
import { db } from '@/lib/db';
import type { CourseModel } from '@/types/course';

export const runtime = 'edge';

const Home = async () => {
  const courseData: CourseModel[] = await db.select().from(courses).all();
  if (courseData.length === 0) return <div>データがありません</div>;

  return (
    <main>
      <IndexContainer courses={courseData} />
    </main>
  );
};
export default Home;
