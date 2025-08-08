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
  const { currentSearchOptions, setSearchOptions } = useSearchOptions();

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          (!currentSearchOptions.semester || course.semester === currentSearchOptions.semester) &&
          (!currentSearchOptions.targetYear ||
            currentSearchOptions.targetYear.length === 0 ||
            currentSearchOptions.targetYear.some((year) => course.targetYear?.includes(year))) &&
          (!currentSearchOptions.typeOfConduction ||
            course.typeOfConduction === currentSearchOptions.typeOfConduction) &&
          (!currentSearchOptions.day || course.day === currentSearchOptions.day) &&
          (!currentSearchOptions.period || course.period === currentSearchOptions.period) &&
          (!currentSearchOptions.languageOptions ||
            course.languageOptions === currentSearchOptions.languageOptions) &&
          (!currentSearchOptions.groupName ||
            course.groupName.length === 0 ||
            currentSearchOptions.groupName.some((group) => course.groupName.includes(group))),
      ),
    [courses, currentSearchOptions],
  );

  const allGroupNames = useMemo(
    () => Array.from(new Set(courses.flatMap((course) => course.groupName))),
    [courses],
  );

  return (
    <div className="mx-auto w-full">
      {/* モバイル表示 */}
      <div className="lg:hidden">
        <div className="space-y-2 py-4">
          <FilterInput
            searchOptionsState={currentSearchOptions}
            setSearchOptions={setSearchOptions}
            groupNameOptions={allGroupNames}
          />
          {filteredCourses.length === 0 ? (
            <EmptyResult />
          ) : (
            <CourseList courses={filteredCourses} />
          )}
        </div>
        <FloatingTimetableButton />
      </div>

      {/* PC表示 */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:py-6">
        <div className="col-span-8 flex flex-col gap-6">
          <FilterInput
            searchOptionsState={currentSearchOptions}
            setSearchOptions={setSearchOptions}
            groupNameOptions={allGroupNames}
          />

          <div>
            {filteredCourses.length === 0 ? (
              <EmptyResult />
            ) : (
              <CourseList courses={filteredCourses} />
            )}
          </div>
        </div>

        <div className="col-span-4">
          <div className="sticky top-6 rounded-lg border bg-white shadow-lg">
            <TimetableDisplay variant="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
};
