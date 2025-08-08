'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { TimetableGridItem } from '@/components/ui/TimetableGrid';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import { dayOptions, periodOptions, semesterOptions } from '@/constants/searchOptions';
import { useTimetableContext } from '@/contexts/TimetableContext';
import type { Day, Period, Semester } from '@/types/searchOptions';
import { semesterSchema } from '@/types/searchOptions';
import { cn } from '@/utils/cn';

type TimetableDisplayVariant = 'modal' | 'sidebar';

type Props = {
  variant: TimetableDisplayVariant;
  onSemesterChange?: (semester: Semester | null) => void; // 学期選択の変更を親に通知
};

export const TimetableDisplay = ({ variant, onSemesterChange }: Props) => {
  const {
    timetable,
    filteredTimetable,
    selectedSemester,
    setSelectedSemester,
    removeCourseFromTimetable,
  } = useTimetableContext();

  const handleSemesterChange = (semester: Semester | null) => {
    setSelectedSemester(semester);
    onSemesterChange?.(semester);
  };

  const items: TimetableGridItem[] = filteredTimetable
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
      onRemove: () => removeCourseFromTimetable(c),
    }));

  const springCount = timetable.filter((c) => c.semester === '春学期').length;
  const fallCount = timetable.filter((c) => c.semester === '秋学期').length;

  return (
    <div className={variant === 'sidebar' ? 'p-4' : ''}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">マイ時間割</h2>
          <p className="text-sm text-gray-600">
            {selectedSemester
              ? `${selectedSemester}: ${filteredTimetable.length}件`
              : `全期間: ${timetable.length}件 (春学期: ${springCount}件, 秋学期: ${fallCount}件)`}
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            エクスポート
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 size-4" />
            共有
          </Button>
        </div> */}
      </div>

      <div className="mt-4">
        <Select
          value={selectedSemester ?? 'all'}
          onValueChange={(value) => {
            const newSemester = value === 'all' ? null : semesterSchema.parse(value);
            handleSemesterChange(newSemester);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="学期を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全期間</SelectItem>
            {semesterOptions.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={variant === 'sidebar' ? 'mt-4' : 'mt-4'}>
        {filteredTimetable.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <p className={cn('text-lg', variant === 'sidebar' && 'text-sm')}>
                {selectedSemester
                  ? `${selectedSemester}の講義が登録されていません`
                  : 'まだ講義が登録されていません'}
              </p>
              <p className={cn('mt-2 text-sm', variant === 'sidebar' && 'mt-1 text-xs')}>
                講義一覧から「マイ時間割に追加」ボタンで登録してください
              </p>
            </div>
          </div>
        ) : (
          <TimetableGrid dayHeaders={dayOptions} periodHeaders={periodOptions} items={items} />
        )}
      </div>
    </div>
  );
};
