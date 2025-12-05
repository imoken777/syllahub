import { CourseList } from '@/components/model/course/CourseList';
import { EmptyResult } from '@/components/model/course/EmptyResult';
import { FilterInput } from '@/components/model/course/FilterInput';
import { FloatingTimetableButton } from '@/components/model/timetable/FloatingTimetableButton';
import { TimetableDisplay } from '@/components/model/timetable/TimetableDisplay';
import type { CourseModel } from '@/types/course';
import type { SearchOptions } from '@/types/searchOptions';

type Props = {
  courses: CourseModel[];
  searchOptions: SearchOptions;
};

export const MainLayout = ({ courses, searchOptions }: Props) => {
  const filteredCourses = courses.filter(
    (course) =>
      (!searchOptions.semester || course.semester === searchOptions.semester) &&
      (!searchOptions.targetYear ||
        searchOptions.targetYear.length === 0 ||
        searchOptions.targetYear.some((year) => course.targetYear?.includes(year))) &&
      (!searchOptions.typeOfConduction ||
        course.typeOfConduction === searchOptions.typeOfConduction) &&
      (!searchOptions.day || course.day === searchOptions.day) &&
      (!searchOptions.period || course.period === searchOptions.period) &&
      (!searchOptions.languageOptions ||
        course.languageOptions === searchOptions.languageOptions) &&
      (!searchOptions.groupName ||
        course.groupName.length === 0 ||
        searchOptions.groupName.some((group) => course.groupName.includes(group))),
  );

  const allGroupNames = Array.from(new Set(courses.flatMap((course) => course.groupName)));

  return (
    <main className="mx-auto w-full">
      {/* モバイル表示 */}
      <div className="lg:hidden">
        <div className="space-y-2 py-4">
          <FilterInput initialSearchOptions={searchOptions} groupNameOptions={allGroupNames} />
          <section>
            {filteredCourses.length === 0 ? (
              <EmptyResult />
            ) : (
              <CourseList courses={filteredCourses} />
            )}
          </section>
        </div>
        <FloatingTimetableButton />
      </div>

      {/* PC表示 */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:py-6">
        <div className="col-span-8 flex flex-col gap-6">
          <FilterInput initialSearchOptions={searchOptions} groupNameOptions={allGroupNames} />

          <section>
            {filteredCourses.length === 0 ? (
              <EmptyResult />
            ) : (
              <CourseList courses={filteredCourses} />
            )}
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
