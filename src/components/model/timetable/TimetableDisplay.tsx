'use client';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import { dayOptions, periodOptions, semesterOptions } from '@/constants/searchOptions';
import { useTimetableContext } from '@/contexts/TimetableContext';
import { semesterSchema } from '@/types/searchOptions';
import { cn } from '@/utils/cn';
import { Share2Icon } from 'lucide-react';
import { useState } from 'react';
import * as v from 'valibot';
import { TimetableSharePage } from './TimetableSharePage';
import { convertCoursesToTimetableItems } from './utils/convertCoursesToTimetableItems';

type TimetableDisplayVariant = 'modal' | 'sidebar';

type Props = {
  variant: TimetableDisplayVariant;
};

export const TimetableDisplay = ({ variant }: Props) => {
  const [showShare, setShowShare] = useState(false);
  const {
    timetable,
    filteredTimetable,
    selectedSemester,
    setSelectedSemester,
    removeCourseFromTimetable,
  } = useTimetableContext();

  const isModalVariant = variant === 'modal';
  const isSidebarVariant = variant === 'sidebar';
  const shouldShowSharePage = showShare && isModalVariant;
  const shouldShowShareDialog = showShare && isSidebarVariant;

  const items = convertCoursesToTimetableItems(filteredTimetable, removeCourseFromTimetable);

  const springCount = timetable.filter((c) => c.semester === '春学期').length;
  const fallCount = timetable.filter((c) => c.semester === '秋学期').length;

  if (shouldShowSharePage) {
    return (
      <div className="p-4">
        <TimetableSharePage
          semester={selectedSemester}
          courses={filteredTimetable}
          onBack={() => setShowShare(false)}
          variant="page"
        />
      </div>
    );
  }

  return (
    <div className={isSidebarVariant ? 'p-4' : ''}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">マイ時間割</h2>
          <p className="text-sm text-gray-600">
            {selectedSemester
              ? `${selectedSemester}: ${filteredTimetable.length}件`
              : `全期間: ${timetable.length}件 (春学期: ${springCount}件, 秋学期: ${fallCount}件)`}
          </p>
        </div>
        <div className="flex gap-2">
          {isModalVariant ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShare(true)}
              disabled={filteredTimetable.length === 0}
              title={
                filteredTimetable.length === 0
                  ? '時間割に講義を追加してから共有してください'
                  : 'Twitterで時間割を共有'
              }
            >
              <Share2Icon className="mr-2 size-4" />
              Twitterで共有
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShare(true)}
                disabled={filteredTimetable.length === 0}
                title={
                  filteredTimetable.length === 0
                    ? '時間割に講義を追加してから共有してください'
                    : 'Twitterで時間割を共有'
                }
              >
                <Share2Icon className="mr-2 size-4" />
                Twitterで共有
              </Button>

              <Dialog open={shouldShowShareDialog} onOpenChange={setShowShare}>
                <DialogContent className="h-5/6 w-11/12 max-w-sm overflow-y-auto p-4 pt-12 sm:h-5/6 sm:w-11/12 sm:max-w-2xl sm:p-6 md:h-5/6 md:w-4/5 md:max-w-4xl lg:h-4/5 lg:w-3/5 lg:max-w-5xl">
                  <DialogTitle className="sr-only">時間割を共有</DialogTitle>
                  <DialogDescription className="sr-only">
                    時間割の画像を生成してTwitterで共有するためのダイアログです。
                  </DialogDescription>
                  <TimetableSharePage
                    semester={selectedSemester}
                    courses={filteredTimetable}
                    onBack={() => setShowShare(false)}
                    containerSelector="[data-timetable-container]"
                    variant="dialog"
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Select
          value={selectedSemester ?? 'all'}
          onValueChange={(value) => {
            const newSemester = value === 'all' ? null : v.parse(semesterSchema, value);
            setSelectedSemester(newSemester);
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

      <div className="mt-4" data-timetable-container>
        {filteredTimetable.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <p className={cn('text-lg', isSidebarVariant && 'text-sm')}>
                {selectedSemester
                  ? `${selectedSemester}の講義が登録されていません`
                  : 'まだ講義が登録されていません'}
              </p>
              <p className={cn('mt-2 text-sm', isSidebarVariant && 'mt-1 text-xs')}>
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
