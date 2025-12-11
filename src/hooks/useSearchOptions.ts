import type { SearchOptions } from '@/types/searchOptions';
import { courseSearchParamDefinitions, searchOptionsSchema } from '@/types/searchOptions';
import { parseSearchParams, serializeToSearchParams } from '@/utils/searchParams';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import * as v from 'valibot';

export const useSearchOptions = () => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const searchOptions: SearchOptions = useMemo(
    () =>
      parseSearchParams(urlSearchParams, courseSearchParamDefinitions, searchOptionsSchema).match(
        (value) => value,
        (error) => {
          console.warn('Failed to parse search params:', error);
          return {};
        },
      ),
    [urlSearchParams],
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
