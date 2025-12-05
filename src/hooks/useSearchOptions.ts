import type { SearchOptions } from '@/types/searchOptions';
import { courseSearchParamDefinitions, searchOptionsSchema } from '@/types/searchOptions';
import { serializeToSearchParams } from '@/utils/searchParams';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as v from 'valibot';

export const useSearchOptions = (initialSearchOptions: SearchOptions) => {
  const router = useRouter();
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(initialSearchOptions);

  const updateSearchOptions = useCallback(
    (option: SearchOptions) => {
      const merged: SearchOptions = { ...searchOptions, ...option };

      const validated = v.safeParse(searchOptionsSchema, merged);
      if (!validated.success) {
        console.warn('Invalid search options:', validated.issues);
        return;
      }
      setSearchOptions(validated.output);

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
