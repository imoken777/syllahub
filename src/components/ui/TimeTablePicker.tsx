import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { dayOptions, periodOptions } from '@/constants/searchOptions';
import type { Day, Period } from '@/types/searchOptions';
import { cn } from '@/utils/cn';
import { CalendarIcon } from 'lucide-react';
import type { FC } from 'react';
import { Fragment } from 'react';

type Props = {
  dayState?: Day;
  periodState?: Period;
  setDayChange: (day: Day | undefined) => void;
  setPeriodChange: (period: Period | undefined) => void;
};

export const TimeTablePicker: FC<Props> = ({
  dayState,
  periodState,
  setDayChange,
  setPeriodChange,
}) => {
  const handleFieldChange = (day: Day, period: Period) => {
    const isSameSelection = dayState === day && periodState === period;
    setDayChange(isSameSelection ? undefined : day);
    setPeriodChange(isSameSelection ? undefined : period);
  };

  const handleDayChange = (day: Day | undefined) => {
    setPeriodChange(undefined);
    setDayChange(day !== dayState || periodState ? day : undefined);
  };

  const handlePeriodChange = (period: Period | undefined) => {
    setDayChange(undefined);
    setPeriodChange(period !== periodState || dayState ? period : undefined);
  };

  const isBlankSelection = !dayState && !periodState;

  const selectedLabel = isBlankSelection
    ? '時間割で指定'
    : dayState && periodState
      ? `${dayState}曜${periodState}`
      : dayState
        ? `${dayState}曜日`
        : `${periodState}`;

  const getDayButtonVariant = (day: Day): 'default' | 'outline' => {
    if (periodState) return 'outline';
    return dayState === day ? 'default' : 'outline';
  };

  const getPeriodButtonVariant = (period: Period): 'default' | 'outline' => {
    if (dayState) return 'outline';
    return periodState === period ? 'default' : 'outline';
  };

  const getFieldButtonVariant = (day: Day, period: Period): 'default' | 'outline' => {
    const isFieldSelected = dayState === day && periodState === period;
    const isDaySelected = dayState === day && !periodState;
    const isPeriodSelected = !dayState && periodState === period;

    if (isFieldSelected || isDaySelected || isPeriodSelected) {
      return 'default';
    }
    return 'outline';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[180px] justify-start text-left font-normal',
            isBlankSelection && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          <span>{selectedLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="grid grid-cols-6 gap-0">
          {/* 左上の空白 */}
          <div className="border p-2" />

          {dayOptions.map((day) => (
            <Button
              key={day}
              variant={getDayButtonVariant(day)}
              onClick={() => handleDayChange(day)}
              className="border p-2 text-center"
            >
              {day}
            </Button>
          ))}

          {periodOptions.map((period) => (
            <Fragment key={period}>
              <Button
                variant={getPeriodButtonVariant(period)}
                onClick={() => handlePeriodChange(period)}
                className="border p-2 text-center"
              >
                {period}
              </Button>
              {dayOptions.map((day) => (
                <Button
                  key={`${day}-${period}`}
                  variant={getFieldButtonVariant(day, period)}
                  onClick={() => handleFieldChange(day, period)}
                  className="size-full border p-2 text-xs"
                />
              ))}
            </Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
