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
import { useSearchOptions } from '@/hooks/useSearchOptions';
import { semesterSchema, typeOfConductionSchema } from '@/types/searchOptions';
import * as v from 'valibot';

import type { FC } from 'react';

type Props = {
  groupNameOptions: string[];
};
export const FilterInput: FC<Props> = ({ groupNameOptions }) => {
  const { searchOptions, updateSearchOptions } = useSearchOptions();

  return (
    <search className="mx-auto p-4" aria-label="講義検索・フィルター">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4">
        <div className="min-w-48 max-w-64 flex-1 basis-48">
          <Select
            value={searchOptions.semester ?? ''}
            onValueChange={(value) =>
              updateSearchOptions({
                semester: value !== 'all' && v.is(semesterSchema, value) ? value : undefined,
              })
            }
          >
            <SelectTrigger className="w-full" aria-label="学期を選択">
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
            value={searchOptions.groupName ?? []}
            onChange={(value) =>
              updateSearchOptions({
                groupName: value.length > 0 ? value : undefined,
              })
            }
            placeholder="グループを選択"
          />
        </div>

        <div className="min-w-48 max-w-64 flex-1 basis-48">
          <Select
            value={searchOptions.typeOfConduction ?? ''}
            onValueChange={(value) =>
              updateSearchOptions({
                typeOfConduction:
                  value !== 'all' && v.is(typeOfConductionSchema, value) ? value : undefined,
              })
            }
          >
            <SelectTrigger className="w-full" aria-label="授業形態を選択">
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
            dayState={searchOptions.day}
            periodState={searchOptions.period}
            onChange={(day, period) => updateSearchOptions({ day, period })}
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
                  checked={searchOptions.targetYear?.includes(grade) ?? false}
                  onCheckedChange={(checked) =>
                    updateSearchOptions({
                      targetYear: checked
                        ? searchOptions.targetYear
                          ? [...searchOptions.targetYear, grade]
                          : [grade]
                        : searchOptions.targetYear?.filter((year) => year !== grade),
                    })
                  }
                />
                <span className="text-sm">{grade}年生</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </search>
  );
};
