import type { SearchOptions } from '@/types/searchOptions';
import { useCallback, useReducer } from 'react';

const reducer = (state: SearchOptions, action: SearchOptions) => ({ ...state, ...action });

export const useSearchOptions = () => {
  const [currentSearchOptions, dispatch] = useReducer(reducer, {});

  const setSearchOptions = useCallback((option: SearchOptions) => dispatch(option), [dispatch]);

  return { currentSearchOptions, setSearchOptions };
};
