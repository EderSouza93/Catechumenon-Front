'use client';

import { useEffect, useState } from 'react';
import { documentsClient } from '@/services/documentsClient';
import { SearchDocumentType, type SearchResultItem } from '@/types';

type Params = {
  q: string;
  type?: SearchDocumentType;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

export function useDocumentsSearch({
  q,
  type,
  page = 1,
  limit = 10,
  enabled = true,
}: Params) {
  const [results, setResults] = useState<SearchResultItem[]>([]);
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
      .searchDocuments({ q, type, page, limit })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results);
        setTotal(data.total);
      })
      .catch(() => { if (!cancelled) setIsError(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [q, type, page, limit, enabled]);

  return { results, total, page, limit, isLoading, isError };
}
