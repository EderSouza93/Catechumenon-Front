'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthProvider';
import { progressClient, type UpdateProgressPayload } from '@/services/progressClient';
import type { ConfessionChapter, ProgressCollection, ReadingProgress } from '@/types';

const LEGACY_LOCALSTORAGE_KEY = 'westminster-progress';

const EMPTY_PROGRESS: ReadingProgress = {
  confessionArticles: [],
  largerCatechism: [],
  shorterCatechism: [],
};

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function countCompletedConfessionChapters(
  articleIds: string[],
  chapters: ConfessionChapter[],
): number {
  if (chapters.length === 0) return 0;
  const read = new Set(articleIds);
  return chapters.reduce((count, chapter) => {
    if (chapter.articles.length === 0) return count;
    const allRead = chapter.articles.every((article) => read.has(article.id));
    return allRead ? count + 1 : count;
  }, 0);
}

export function useProgress() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress>(EMPTY_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setProgress(EMPTY_PROGRESS);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY);
    }

    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    progressClient
      .getProgress()
      .then((data) => {
        if (cancelled) return;
        setProgress({
          confessionArticles: data.confessionArticles ?? [],
          largerCatechism: data.largerCatechism ?? [],
          shorterCatechism: data.shorterCatechism ?? [],
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Falha ao carregar progresso do servidor', error);
        setIsError(true);
        toast.error('Não foi possível carregar seu progresso. Recarregue a página para tentar novamente.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading]);

  const applyToggle = useCallback(
    async (collection: ProgressCollection, id: string) => {
      const snapshot = progressRef.current;
      const nextList = toggleId(snapshot[collection], id);
      const nextProgress: ReadingProgress = { ...snapshot, [collection]: nextList };
      setProgress(nextProgress);
      setIsSyncing(true);
      setIsError(false);

      const payload: UpdateProgressPayload = { [collection]: nextList };
      try {
        const result = await progressClient.updateProgress(payload);
        setProgress({
          confessionArticles: result.confessionArticles ?? nextList,
          largerCatechism: result.largerCatechism ?? nextProgress.largerCatechism,
          shorterCatechism: result.shorterCatechism ?? nextProgress.shorterCatechism,
        });
      } catch (error) {
        console.error('Falha ao sincronizar progresso', error);
        setProgress(snapshot);
        setIsError(true);
        toast.error('Não foi possível salvar seu progresso. Tente novamente.');
      } finally {
        setIsSyncing(false);
      }
    },
    [],
  );

  const toggleConfessionArticle = useCallback(
    (articleId: string) => applyToggle('confessionArticles', articleId),
    [applyToggle],
  );

  const toggleLargerCatechism = useCallback(
    (questionId: string) => applyToggle('largerCatechism', questionId),
    [applyToggle],
  );

  const toggleShorterCatechism = useCallback(
    (questionId: string) => applyToggle('shorterCatechism', questionId),
    [applyToggle],
  );

  return {
    progress,
    isLoading,
    isError,
    isSyncing,
    toggleConfessionArticle,
    toggleLargerCatechism,
    toggleShorterCatechism,
  };
}
