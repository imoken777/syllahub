'use client';

import { TimetableModal } from '@/components/model/timetable/TimetableModal';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

export const FloatingTimetableButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-blue-600 p-0 shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        aria-label="マイ時間割を開く"
      >
        <Calendar className="size-6 text-white" />
      </Button>

      <TimetableModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
