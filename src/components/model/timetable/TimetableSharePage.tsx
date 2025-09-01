'use client';

import { Button } from '@/components/ui/Button';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import { dayOptions, periodOptions } from '@/constants/searchOptions';
import type { CourseModel } from '@/types/course';
import type { Semester } from '@/types/searchOptions';
import { downloadFile } from '@/utils/downloadFile';
import { generateElementImage } from '@/utils/elementImageGenerator';
import { ArrowLeft, Download, ExternalLinkIcon, ImageIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { convertCoursesToTimetableItems } from './utils/convertCoursesToTimetableItems';
import {
  generateTimetableImageFilename,
  generateTimetableShareText,
  generateTwitterShareUrl,
} from './utils/shareUtils';

type TimetableSharePageProps = {
  semester: Semester | null;
  courses: CourseModel[];
  onBack: () => void;
  variant: 'page' | 'dialog';
  containerSelector?: string;
};

export const TimetableSharePage = ({
  semester,
  courses,
  onBack,
  variant,
  containerSelector = '[data-share-timetable-container]',
}: TimetableSharePageProps) => {
  const [imageGenerationState, setImageGenerationState] = useState<
    'idle' | 'generating' | 'completed'
  >('idle');
  const timetableRef = useRef<HTMLDivElement>(null);

  const isImageGenerating = imageGenerationState === 'generating';
  const isImageSaved = imageGenerationState === 'completed';

  const timetableItems = convertCoursesToTimetableItems(courses);

  const getTimetableContainer = useCallback((): HTMLElement => {
    let container: Element | null = null;

    if (timetableRef.current) {
      container = timetableRef.current.querySelector('.grid.grid-cols-6');
    }

    if (!container && timetableRef.current) {
      const shareGridContainer = timetableRef.current.querySelector('[data-share-timetable-grid]');
      if (shareGridContainer) {
        container = shareGridContainer.querySelector('.grid.grid-cols-6') ?? shareGridContainer;
      }
    }

    if (!container) {
      container = document.querySelector(`${containerSelector} .grid.grid-cols-6`);
    }

    if (!container) {
      throw new Error('時間割のグリッド要素が見つかりません。');
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error('取得した要素がHTMLElementではありません。');
    }

    return container;
  }, [containerSelector]);

  const handleSaveImage = async () => {
    if (courses.length === 0) {
      alert('時間割に講義を追加してから共有してください。');
      return;
    }

    setImageGenerationState('generating');

    try {
      window.scrollTo(0, 0);

      const timetableContainer = getTimetableContainer();

      const blob = await generateElementImage(timetableContainer, ['data-remove-button']);
      const filename = generateTimetableImageFilename(semester);
      downloadFile(blob, filename);

      setImageGenerationState('completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '画像の生成に失敗しました。';
      alert(errorMessage);
      setImageGenerationState('idle');
    }
  };

  const handleTwitterShare = () => {
    const shareText = generateTimetableShareText(semester, courses.length);
    const twitterUrl = generateTwitterShareUrl(shareText);
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {variant === 'page' && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">時間割を共有</h2>
          <p className="text-sm text-gray-600">以下の手順で時間割を共有できます</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              1
            </div>
            <h3 className="text-lg font-medium">時間割画像を保存</h3>
          </div>
          <p className="pl-11 text-gray-600">まず、時間割の画像をダウンロードしてください</p>
          <div className="pl-11">
            <Button
              onClick={handleSaveImage}
              disabled={isImageGenerating || courses.length === 0}
              className="w-full"
              size="lg"
            >
              <ImageIcon className="mr-2 size-5" />
              {isImageGenerating ? '生成中...' : '画像を保存'}
            </Button>
          </div>
          {isImageSaved && (
            <div className="pl-11">
              <div className="flex items-center gap-2 text-green-600">
                <Download className="size-4" />
                <span className="text-sm font-medium">画像が保存されました</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              2
            </div>
            <h3 className="text-lg font-medium text-gray-900">Twitterで投稿</h3>
          </div>
          <p className="pl-11 text-gray-600">
            投稿画面が開いたら、保存した画像ファイルを<strong>手動で添付</strong>
            してから投稿してください
          </p>
          <div className="pl-11">
            <Button onClick={handleTwitterShare} variant="outline" className="w-full" size="lg">
              <ExternalLinkIcon className="mr-2 size-5" />
              Twitterで投稿
            </Button>
          </div>
        </div>

        {variant === 'page' && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">時間割プレビュー</h3>
            <div
              ref={timetableRef}
              className="rounded-lg border bg-white p-4"
              data-share-timetable-container
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {semester ? `${semester}の時間割` : 'マイ時間割'}
                </h4>
                <p className="text-sm text-gray-600">{courses.length}件の講義</p>
              </div>
              <div data-share-timetable-grid>
                {courses.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <p>講義が登録されていません</p>
                  </div>
                ) : (
                  <TimetableGrid
                    dayHeaders={dayOptions}
                    periodHeaders={periodOptions}
                    items={timetableItems}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
