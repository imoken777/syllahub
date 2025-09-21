import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTimetableContext } from '@/contexts/TimetableContext';
import type { CourseModel } from '@/types/course';
import { CalendarPlus, Check, ExternalLink } from 'lucide-react';

type Props = {
  course: CourseModel;
};

export const CourseItem = ({ course }: Props) => {
  const { addCourseToTimetable, getCourseStatus } = useTimetableContext();

  const courseStatus = getCourseStatus(course);

  const handleAddToTimetable = () => {
    if (courseStatus.canAdd) {
      const success = addCourseToTimetable(course);
      if (!success) {
        // 追加に失敗した場合のハンドリング（必要に応じて）
        console.warn('Failed to add course to timetable');
      }
    }
  };

  return (
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
          {courseStatus.isInTimetable ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center space-x-1 bg-green-50 text-green-700"
            >
              <Check className="size-4" />
              <span>追加済み</span>
            </Button>
          ) : courseStatus.hasTimeConflict ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center space-x-1 bg-red-50 text-red-700"
            >
              <CalendarPlus className="size-4" />
              <span>時間重複</span>
            </Button>
          ) : courseStatus.canAdd ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToTimetable}
              className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-700"
            >
              <CalendarPlus className="size-4" />
              <span>マイ時間割に追加</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center space-x-1 bg-gray-50 text-gray-500"
            >
              <CalendarPlus className="size-4" />
              <span>時間未設定</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};
