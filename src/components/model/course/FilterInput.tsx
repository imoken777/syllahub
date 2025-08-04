'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { MultiSelect } from '@/components/ui/MultiSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { TimeTablePicker } from '@/components/ui/TimeTablePicker';
import {
  semesterOptions,
  targetYearOptions,
  typeOfConductionOptions,
} from '@/constants/searchOptions';
import type { SearchOptions } from '@/types/searchOptions';
import { semesterSchema, typeOfConductionSchema } from '@/types/searchOptions';

import type { FC } from 'react';

type Props = {
  searchOptionsState: SearchOptions;
  setSearchOptions: (option: SearchOptions) => void;
  groupNameOptions: string[];
};
export const FilterInput: FC<Props> = ({
  searchOptionsState,
  setSearchOptions,
  groupNameOptions,
}) => (
  <div className="mx-auto p-4">
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4">
      <div className="min-w-48 max-w-64 flex-1 basis-48">
        <Select
          value={searchOptionsState.semester ?? ''}
          onValueChange={(value) =>
            setSearchOptions({
              semester: value === 'all' ? undefined : semesterSchema.safeParse(value).data,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="学期を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            {semesterOptions.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-48 max-w-64 flex-1 basis-48">
        <MultiSelect
          options={groupNameOptions.map((groupName) => ({
            value: groupName,
            label: groupName,
          }))}
          value={searchOptionsState.groupName ?? []}
          onChange={(value) =>
            setSearchOptions({
              groupName: value.length > 0 ? value : undefined,
            })
          }
          placeholder="グループを選択"
        />
      </div>

      <div className="min-w-48 max-w-64 flex-1 basis-48">
        <Select
          value={searchOptionsState.typeOfConduction ?? ''}
          onValueChange={(value) =>
            setSearchOptions({
              typeOfConduction:
                value === 'all' ? undefined : typeOfConductionSchema.safeParse(value).data,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="授業形態を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            {typeOfConductionOptions.map((typeOfConduction) => (
              <SelectItem key={typeOfConduction} value={typeOfConduction}>
                {typeOfConduction}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-48 max-w-64 flex-1 basis-48">
        <TimeTablePicker
          dayState={searchOptionsState.day}
          periodState={searchOptionsState.period}
          setDayChange={(day) => setSearchOptions({ day: day })}
          setPeriodChange={(period) => setSearchOptions({ period: period })}
        />
      </div>

      <div className="min-w-60 max-w-80 flex-1 basis-60">
        <div className="flex h-10 w-full items-center gap-4 rounded-md border border-input bg-background px-3 py-2 ring-offset-background">
          {targetYearOptions.map((grade) => (
            <label
              key={grade}
              className="flex cursor-pointer select-none items-center gap-1 whitespace-nowrap"
              htmlFor={`checkbox-${grade}`}
            >
              <Checkbox
                id={`checkbox-${grade}`}
                checked={searchOptionsState.targetYear?.includes(grade) ?? false}
                onCheckedChange={(checked) =>
                  setSearchOptions({
                    targetYear: checked
                      ? searchOptionsState.targetYear
                        ? [...searchOptionsState.targetYear, grade]
                        : [grade]
                      : searchOptionsState.targetYear?.filter((year) => year !== grade),
                  })
                }
              />
              <span className="text-sm">{grade}年生</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);
