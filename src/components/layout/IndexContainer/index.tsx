'use client';

import { CourseList } from '@/components/model/course/CourseList';
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
          (!currentSearchOptions.typeOfConduction ||
            course.typeOfConduction === currentSearchOptions.typeOfConduction) &&
          (!currentSearchOptions.day || course.day === currentSearchOptions.day) &&
          (!currentSearchOptions.period || course.period === currentSearchOptions.period) &&
          (!currentSearchOptions.languageOptions ||
            course.languageOptions === currentSearchOptions.languageOptions) &&
          (!currentSearchOptions.groupName || course.groupName === currentSearchOptions.groupName),
      ),
    [courses, currentSearchOptions],
  );
  const allGroupNames = useMemo(
    () => Array.from(new Set(courses.map((course) => course.groupName))),
    [courses],
  );

  return (
    <div>
      <FilterInput
        searchOptionsState={currentSearchOptions}
        setSearchOptions={setSearchOptions}
        groupNameOptions={allGroupNames}
      />
      <CourseList courses={filteredCourses} />
    </div>
  );
};
