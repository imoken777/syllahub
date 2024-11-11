'use client';

import { Checkbox } from '@/components/ui/Checkbox';
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
  <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
    <Select
      value={searchOptionsState.semester ?? ''}
      onValueChange={(value) =>
        setSearchOptions({
          semester: value === 'all' ? undefined : semesterSchema.safeParse(value).data,
        })
      }
    >
      <SelectTrigger className="w-full sm:w-[180px]">
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

    <div className="flex flex-wrap gap-4">
      <span className="font-medium">対象学年：</span>
      {targetYearOptions.map((grade) => (
        <label key={grade} className="flex items-center space-x-2" htmlFor={`checkbox-${grade}`}>
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
          <span>{grade}年生</span>
        </label>
      ))}
    </div>

    <Select
      value={searchOptionsState.groupName ?? ''}
      onValueChange={(value) =>
        setSearchOptions({
          groupName: value === 'all' ? undefined : value,
        })
      }
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="グループを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全て</SelectItem>
        {groupNameOptions.map((groupName) => (
          <SelectItem key={groupName} value={groupName}>
            {groupName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      value={searchOptionsState.typeOfConduction ?? ''}
      onValueChange={(value) =>
        setSearchOptions({
          typeOfConduction:
            value === 'all' ? undefined : typeOfConductionSchema.safeParse(value).data,
        })
      }
    >
      <SelectTrigger className="w-full sm:w-[180px]">
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

    <TimeTablePicker
      dayState={searchOptionsState.day}
      periodState={searchOptionsState.period}
      setDayChange={(day) => setSearchOptions({ day: day })}
      setPeriodChange={(period) => setSearchOptions({ period: period })}
    />
  </div>
);
