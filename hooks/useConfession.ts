'use client';

import { useEffect, useState } from 'react';
import { documentsClient } from '@/services/documentsClient';
import type { ConfessionChapter } from '@/types';

type Params = { page?: number; limit?: number };

export function useConfession({ page = 1, limit = 3 }: Params = {}) {
  const [items, setItems] = useState<ConfessionChapter[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    documentsClient
      .getConfession({ page, limit })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => { if (!cancelled) setIsError(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [page, limit]);

  return { items, total, page, limit, isLoading, isError };
}
