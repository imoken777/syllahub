import type { TimetableGridItem } from '@/components/ui/TimetableGrid';
import { dayOptions, periodOptions } from '@/constants/searchOptions';
import type { CourseModel } from '@/types/course';
import type { Day, Period } from '@/types/searchOptions';

/**
 * CourseModelの配列をTimetableGridItem配列に変換する
 * @param courses - 変換するコース配列
 * @param onRemove - 削除時のコールバック関数（オプション）
 * @returns TimetableGridItem配列
 */
export const convertCoursesToTimetableItems = (
  courses: CourseModel[],
  onRemove?: (course: CourseModel) => void,
): TimetableGridItem[] =>
  courses
    .filter(
      (c): c is typeof c & { day: Day; period: Period } => c.day !== null && c.period !== null,
    )
    .map((c) => ({
      row: periodOptions.indexOf(c.period),
      col: dayOptions.indexOf(c.day),
      label: c.courseName,
      semester: c.semester,
      tooltipTitle: c.courseName,
      tooltipSubtitle: `${c.semester} - ${c.typeOfConduction ?? ''}`
        .trim()
        .replace(/^-\s*/, '')
        .replace(/\s*-$/, ''),
      onRemove: onRemove ? () => onRemove(c) : undefined,
    }));
