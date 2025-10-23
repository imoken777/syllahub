'use client';

import { Button } from '@/components/ui/Button';
import { useTimetableContext } from '@/contexts/TimetableContext';
import type { CourseModel } from '@/types/course';
import { CalendarPlus, Check } from 'lucide-react';

type Props = {
  course: CourseModel;
};

export const AddToTimetableButton = ({ course }: Props) => {
  const { addCourseToTimetable, getCourseStatus } = useTimetableContext();

  const courseStatus = getCourseStatus(course);

  const handleAddToTimetable = () => {
    if (courseStatus.canAdd) {
      const success = addCourseToTimetable(course);
      if (!success) {
        // 追加に失敗した場合のハンドリング(必要に応じて)
        console.warn('Failed to add course to timetable');
      }
    }
  };

  if (courseStatus.isInTimetable) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="flex items-center space-x-1 bg-green-50 text-green-700"
      >
        <Check className="size-4" />
        <span>追加済み</span>
      </Button>
    );
  }

  if (courseStatus.hasTimeConflict) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="flex items-center space-x-1 bg-red-50 text-red-700"
      >
        <CalendarPlus className="size-4" />
        <span>時間重複</span>
      </Button>
    );
  }

  if (courseStatus.canAdd) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddToTimetable}
        className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-700"
      >
        <CalendarPlus className="size-4" />
        <span>マイ時間割に追加</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className="flex items-center space-x-1 bg-gray-50 text-gray-500"
    >
      <CalendarPlus className="size-4" />
      <span>時間未設定</span>
    </Button>
  );
};
