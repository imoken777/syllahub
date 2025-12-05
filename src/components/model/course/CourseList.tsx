import type { CourseModel } from '@/types/course';
import { CourseItem } from './CourseItem';

export const CourseList = ({ courses }: { courses: CourseModel[] }) => (
  <div className="space-y-4">
    {courses.map((course) => (
      <CourseItem key={course.courseId} course={course} />
    ))}
  </div>
);
