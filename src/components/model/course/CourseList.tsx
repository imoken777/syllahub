'use client';

import { useSearchOptions } from '@/hooks/useSearchOptions';
import type { CourseModel } from '@/types/course';
import { useMemo } from 'react';
import { CourseItem } from './CourseItem';
import { EmptyResult } from './EmptyResult';

export const CourseList = ({ courses }: { courses: CourseModel[] }) => {
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

  if (filteredCourses.length === 0) {
    return <EmptyResult />;
  }

  return (
    <div className="optimize-scroll space-y-4">
      {filteredCourses.map((course) => (
        <div key={course.courseId} className="content-visibility-auto">
          <CourseItem course={course} />
        </div>
      ))}
    </div>
  );
};
