'use client';

import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const TimetableModal = dynamic(
  () => import('@/components/model/timetable/TimetableModal').then((mod) => mod.TimetableModal),
  { ssr: false },
);

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
