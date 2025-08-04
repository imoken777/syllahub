'use client';

import { CourseList } from '@/components/model/course/CourseList';
import { EmptyResult } from '@/components/model/course/EmptyResult';
import { FilterInput } from '@/components/model/course/FilterInput';
import type { CourseModel } from '@/types/course';
import { useMemo } from 'react';
import { useSearchOptions } from './hook';

export const IndexContainer = ({ courses }: { courses: CourseModel[] }) => {
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
    () => Array.from(new Set(courses.map((course) => course.groupName))),
    [courses],
  );

  return (
    <div className="container mx-auto">
      <FilterInput
        searchOptionsState={currentSearchOptions}
        setSearchOptions={setSearchOptions}
        groupNameOptions={allGroupNames}
      />
      {filteredCourses.length === 0 ? <EmptyResult /> : <CourseList courses={filteredCourses} />}
    </div>
  );
};
