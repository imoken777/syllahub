import type { SearchOptions } from '@/types/searchOptions';
import {
  daySchema,
  languageOptionsSchema,
  periodSchema,
  searchOptionsSchema,
  semesterSchema,
  targetYearOptionsSchema,
  typeOfConductionSchema,
} from '@/types/searchOptions';
import type { ParamDefinition } from '@/utils/searchParams';
import { parseSearchParams, serializeToSearchParams } from '@/utils/searchParams';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import * as v from 'valibot';

const courseSearchParamDefinitions: ParamDefinition<unknown>[] = [
  {
    key: 'semester',
    schema: semesterSchema,
  },
  {
    key: 'targetYear',
    schema: targetYearOptionsSchema,
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => JSON.parse(value),
  },
  {
    key: 'typeOfConduction',
    schema: typeOfConductionSchema,
  },
  {
    key: 'day',
    schema: daySchema,
  },
  {
    key: 'period',
    schema: periodSchema,
  },
  {
    key: 'languageOptions',
    schema: languageOptionsSchema,
  },
  {
    key: 'groupName',
    schema: v.array(v.string()),
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => JSON.parse(value),
  },
  {
    key: 'yearOfStudy',
    schema: v.number(),
    serialize: (value) => String(value),
    deserialize: (value) => Number(value),
  },
];

export const useSearchOptions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchOptions = useMemo(
    (): SearchOptions =>
      parseSearchParams(searchParams, courseSearchParamDefinitions, searchOptionsSchema).match(
        (value) => value,
        (error) => {
          console.warn('Failed to parse search params:', error);
          return {};
        },
      ),
    [searchParams],
  );

  const updateSearchOptions = useCallback(
    (option: SearchOptions) => {
      const merged: SearchOptions = { ...searchOptions, ...option };

      const validated = v.safeParse(searchOptionsSchema, merged);
      if (!validated.success) {
        console.warn('Invalid search options:', validated.issues);
        return;
      }

      const params = serializeToSearchParams(
        new URLSearchParams(),
        validated.output,
        courseSearchParamDefinitions,
      );
      // URLを更新(履歴に追加せずに置き換え)
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchOptions],
  );

  return {
    searchOptions,
    updateSearchOptions,
  };
};
