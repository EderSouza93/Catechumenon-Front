'use client';

import { useEffect, useState } from 'react';
import { documentsClient } from '@/services/documentsClient';
import { SearchSource, type UnifiedSearchItem } from '@/types';

type Params = {
  q: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

export function useGlobalSearch({ q, page = 1, limit = 20, enabled = true }: Params) {
  const [results, setResults] = useState<UnifiedSearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!enabled || q.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setIsLoading(false);
      setIsError(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    documentsClient
      .searchGlobal({ q, source: SearchSource.Documents, page, limit })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results);
        setTotal(data.total);
      })
      .catch(() => { if (!cancelled) setIsError(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [q, page, limit, enabled]);

  return { results, total, page, limit, isLoading, isError };
}
