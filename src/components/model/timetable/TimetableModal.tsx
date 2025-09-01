'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { TimetableDisplay } from './TimetableDisplay';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TimetableModal = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="h-5/6 w-11/12 max-w-sm overflow-y-auto p-4 pt-12 sm:h-5/6 sm:w-11/12 sm:max-w-2xl sm:p-6 md:h-5/6 md:w-4/5 md:max-w-4xl lg:h-4/5 lg:w-3/5 lg:max-w-5xl">
      <DialogTitle className="sr-only">時間割表示</DialogTitle>
      <DialogDescription className="sr-only">
        時間割の表示と管理を行うためのモーダルダイアログです。
      </DialogDescription>
      <TimetableDisplay variant="modal" />
    </DialogContent>
  </Dialog>
);
