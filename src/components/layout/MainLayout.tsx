import { FilterInput } from '@/components/model/course/FilterInput';
import { FloatingTimetableButton } from '@/components/model/timetable/FloatingTimetableButton';
import { TimetableDisplay } from '@/components/model/timetable/TimetableDisplay';
import type { CourseModel } from '@/types/course';
import { Suspense } from 'react';
import { CourseList } from '../model/course/CourseList';

type Props = {
  courses: CourseModel[];
};

const CourseListFallback = () => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="h-32 rounded-lg bg-gray-200" />
    ))}
  </div>
);

export const MainLayout = ({ courses }: Props) => {
  const allGroupNames = Array.from(new Set(courses.flatMap((course) => course.groupName)));

  return (
    <main className="mx-auto w-full">
      {/* モバイル表示 */}
      <div className="lg:hidden">
        <div className="space-y-2 py-4">
          <FilterInput groupNameOptions={allGroupNames} />
          <section>
            <Suspense fallback={<CourseListFallback />}>
              <CourseList courses={courses} />
            </Suspense>
          </section>
        </div>
        <FloatingTimetableButton />
      </div>

      {/* PC表示 */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:py-6">
        <div className="col-span-8 flex flex-col gap-6">
          <FilterInput groupNameOptions={allGroupNames} />
          <section>
            <Suspense fallback={<CourseListFallback />}>
              <CourseList courses={courses} />
            </Suspense>
          </section>
        </div>

        <aside className="col-span-4">
          <div className="sticky top-6 rounded-lg border bg-white shadow-lg">
            <TimetableDisplay variant="sidebar" />
          </div>
        </aside>
      </div>
    </main>
  );
};
