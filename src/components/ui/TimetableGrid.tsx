'use client';

import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { X } from 'lucide-react';
import { useState } from 'react';

export type TimetableGridItem = {
  row: number;
  col: number;
  label: string;
  semester?: '春学期' | '秋学期';
  tooltipTitle?: string;
  tooltipSubtitle?: string;
  onRemove?: () => void;
};

type TimetableCellProps = {
  item: TimetableGridItem;
  cellKey: string;
  isTopHalf?: boolean;
  isBottomHalf?: boolean;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
};

const getSemesterStyles = (semester?: '春学期' | '秋学期') => {
  switch (semester) {
    case '春学期':
      return {
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-900',
      };
    case '秋学期':
      return {
        bg: 'bg-orange-100',
        border: 'border-orange-300',
        text: 'text-orange-900',
      };
    default:
      return {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-900',
      };
  }
};

const TimetableCell = ({
  item,
  cellKey,
  isTopHalf,
  isBottomHalf,
  openKey,
  setOpenKey,
}: TimetableCellProps) => {
  const styles = getSemesterStyles(item.semester);
  const roundedClass = isTopHalf ? 'rounded-t' : isBottomHalf ? 'rounded-b' : 'rounded';

  return (
    <Tooltip
      open={openKey === cellKey}
      onOpenChange={(isOpen) => setOpenKey(isOpen ? cellKey : null)}
    >
      <TooltipTrigger asChild>
        <div
          className={`absolute inset-0 cursor-pointer border p-1 ${styles.bg} ${styles.border} ${roundedClass}`}
          onClick={() => setOpenKey(openKey === cellKey ? null : cellKey)}
        >
          {item.onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute -right-2 -top-2 z-10 size-4 touch-none rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                item.onRemove?.();
              }}
              aria-label="Remove item"
              data-remove-button
            >
              <X className="size-3" />
            </Button>
          )}
          <div
            className={`size-full overflow-hidden whitespace-pre-line break-words text-xs font-medium leading-tight sm:text-[10px] md:text-xs ${styles.text}`}
          >
            {item.label}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={5}>
        {item.tooltipTitle && <p className="font-semibold">{item.tooltipTitle}</p>}
        {item.tooltipSubtitle && <p className="text-sm text-gray-400">{item.tooltipSubtitle}</p>}
        {item.semester && <p className="text-xs text-gray-500">{item.semester}</p>}
      </TooltipContent>
    </Tooltip>
  );
};

type TimetableGridProps = {
  dayHeaders: readonly string[];
  periodHeaders: readonly string[];
  items: TimetableGridItem[];
};

export const TimetableGrid = ({ dayHeaders, periodHeaders, items }: TimetableGridProps) => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const cellItemsMap = new Map<
    string,
    {
      spring?: TimetableGridItem;
      fall?: TimetableGridItem;
    }
  >();
  items.forEach((item) => {
    const key = `${item.row}:${item.col}`;
    const existing = cellItemsMap.get(key) ?? {};

    if (item.semester === '春学期') {
      existing.spring = item;
    } else if (item.semester === '秋学期') {
      existing.fall = item;
    } else {
      existing.spring = item;
    }

    cellItemsMap.set(key, existing);
  });

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div /> {/* 左上空白セル */}
        {dayHeaders.map((day) => (
          <div key={day} className="p-1 text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        <TooltipProvider>
          {periodHeaders.map((slot, periodIndex) => (
            <div key={periodIndex} className="contents">
              <div className="p-1 text-center font-medium text-gray-600">{slot}</div>
              {dayHeaders.map((_, dayIndex) => {
                const cellItems = cellItemsMap.get(`${periodIndex}:${dayIndex}`);
                const cellKey = `${periodIndex}:${dayIndex}`;
                const hasSpring = cellItems?.spring;
                const hasFall = cellItems?.fall;
                const hasBoth = hasSpring && hasFall;

                return (
                  <div
                    key={dayIndex}
                    className="relative aspect-square rounded border border-gray-200"
                  >
                    {cellItems && (hasSpring ?? hasFall) && (
                      <div className="absolute inset-0">
                        {hasBoth ? (
                          // 春学期と秋学期両方ある場合は上下に分割
                          <>
                            <div className="relative h-1/2 w-full">
                              <TimetableCell
                                item={hasSpring}
                                cellKey={`${cellKey}-spring`}
                                isTopHalf
                                openKey={openKey}
                                setOpenKey={setOpenKey}
                              />
                            </div>
                            <div className="relative h-1/2 w-full">
                              <TimetableCell
                                item={hasFall}
                                cellKey={`${cellKey}-fall`}
                                isBottomHalf
                                openKey={openKey}
                                setOpenKey={setOpenKey}
                              />
                            </div>
                          </>
                        ) : (
                          // 単一の学期の場合は全体を使用
                          <TimetableCell
                            item={hasSpring ?? hasFall!}
                            cellKey={cellKey}
                            openKey={openKey}
                            setOpenKey={setOpenKey}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
