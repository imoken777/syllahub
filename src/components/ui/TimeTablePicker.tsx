'use client';

import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

const daysOfWeek = ['月', '火', '水', '木', '金'];
const periods = ['1限', '2限', '3限', '4限', '5限', '6限'];

export const TimeTablePicker = () => {
  const [selectedSlots, setSelectedSlots] = useState<{ day: string; period: string }[]>([]);

  const handleSelectSlot = (day: string, period: string) => {
    const isSelected = selectedSlots.some((slot) => slot.day === day && slot.period === period);

    if (isSelected) {
      setSelectedSlots(
        selectedSlots.filter((slot) => !(slot.day === day && slot.period === period)),
      );
    } else {
      setSelectedSlots([...selectedSlots, { day, period }]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            selectedSlots.length === 0 && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selectedSlots.length > 0 ? (
            selectedSlots.map((slot) => `${slot.day} ${slot.period}`).join(', ')
          ) : (
            <span>時間割で指定</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="grid grid-cols-6 gap-0">
          {/* 左上の空白 */}
          <div className="border p-2" />

          {daysOfWeek.map((day) => (
            <div key={day} className="border p-2 text-center">
              {day}
            </div>
          ))}

          {periods.map((period) => (
            <>
              <div key={period} className="border p-2 text-center">
                {period}
              </div>
              {daysOfWeek.map((day) => (
                <Button
                  key={`${day}-${period}`}
                  variant={
                    selectedSlots.some((slot) => slot.day === day && slot.period === period)
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() => handleSelectSlot(day, period)}
                  className="size-full border p-2 text-xs"
                />
              ))}
            </>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
