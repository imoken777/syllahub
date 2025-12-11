'use client';

import { CourseList } from '@/components/model/course/CourseList';
import { EmptyResult } from '@/components/model/course/EmptyResult';
import { FilterInput } from '@/components/model/course/FilterInput';
import { FloatingTimetableButton } from '@/components/model/timetable/FloatingTimetableButton';
import { TimetableDisplay } from '@/components/model/timetable/TimetableDisplay';
import { useSearchOptions } from '@/hooks/useSearchOptions';
import type { CourseModel } from '@/types/course';
import { useMemo } from 'react';

type Props = {
  courses: CourseModel[];
};

export const MainLayout = ({ courses }: Props) => {
  const { searchOptions } = useSearchOptions();

  const filteredCourses = useMemo(() => {
    const targetYearSet = searchOptions.targetYear ? new Set(searchOptions.targetYear) : null;
    const groupNameSet = searchOptions.groupName ? new Set(searchOptions.groupName) : null;

    return courses.filter((course) => {
      if (searchOptions.semester && course.semester !== searchOptions.semester) return false;
      if (
        searchOptions.typeOfConduction &&
        course.typeOfConduction !== searchOptions.typeOfConduction
      )
        return false;
      if (searchOptions.day && course.day !== searchOptions.day) return false;
      if (searchOptions.period && course.period !== searchOptions.period) return false;
      if (searchOptions.languageOptions && course.languageOptions !== searchOptions.languageOptions)
        return false;

      if (targetYearSet && course.targetYear) {
        if (!course.targetYear.some((year) => targetYearSet.has(year))) return false;
      }
      if (groupNameSet && course.groupName) {
        const groupNames: string[] = Array.isArray(course.groupName)
          ? course.groupName
          : [course.groupName];
        if (!groupNames.some((group) => groupNameSet.has(group))) return false;
      }

      return true;
    });
  }, [courses, searchOptions]);

  const allGroupNames = useMemo(
    () => Array.from(new Set(courses.flatMap((course) => course.groupName))),
    [courses],
  );

  return (
    <main className="mx-auto w-full">
      {/* モバイル表示 */}
      <div className="lg:hidden">
        <div className="space-y-2 py-4">
          <FilterInput groupNameOptions={allGroupNames} />
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
          <FilterInput groupNameOptions={allGroupNames} />

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
