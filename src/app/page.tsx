import { IndexContainer } from '@/components/layout/IndexContainer';
import { apiClient } from '@/lib/apiClient';
import type { CourseModel } from '@/types/course';

const Home = async () => {
  const coursesRes = await apiClient.api.course.$get();
  if (!coursesRes.ok) return <div>データの取得に失敗しました</div>;
  const courses: CourseModel[] = await coursesRes.json();

  return (
    <main>
      <IndexContainer courses={courses} />
    </main>
  );
};
export default Home;
