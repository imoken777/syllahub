import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { CourseModel } from '@/types/course';
import { ExternalLink } from 'lucide-react';
import { AddToTimetableButton } from './AddToTimetableButton';

type Props = {
  course: CourseModel;
};

export const CourseItem = ({ course }: Props) => (
  <article className="rounded-lg border-2 border-solid border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className="flex-1 pr-4">
        <h2 className="mb-2 text-lg font-semibold">{course.courseName}</h2>
        <p className="mb-1 text-sm text-gray-600">{course.instructors.join(', ')}</p>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Badge variant={course.semester === '春学期' ? 'spring' : 'autumn'}>
            {course.semester}
          </Badge>
          <Badge variant="secondary">{`${course.day}曜${course.period}`}</Badge>
          <Badge variant="outline">{course.groupName}</Badge>
          <Badge variant="outline">{course.languageOptions}</Badge>
          <Badge variant="outline">{course.typeOfConduction}</Badge>
          <Badge variant="outline">
            {course.targetYear &&
              `${Math.min(...course.targetYear)}~${Math.max(...course.targetYear)}年次`}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          {course.syllabusLink && (
            <a href={course.syllabusLink}>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <span>シラバス</span>
                <ExternalLink className="size-4" />
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <AddToTimetableButton course={course} />
      </div>
    </div>
  </article>
);
