'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthProvider';
import { progressClient, type UpdateProgressPayload } from '@/services/progressClient';
import type {
  ConfessionChapter,
  ProgressCollection,
  ProgressView,
  ReadingProgress,
  ResumePosition,
} from '@/types';

const LEGACY_LOCALSTORAGE_KEY = 'westminster-progress';

const EMPTY_PROGRESS: ReadingProgress = {
  confessionArticles: [],
  largerCatechism: [],
  shorterCatechism: [],
};

const EMPTY_RESUME: ResumePosition = {
  shorterCatechism: null,
  largerCatechism: null,
  confession: null,
};

const cacheKey = (userId: string) => `catechumenon:progress:${userId}`;

function readCache(userId: string): ProgressView | null {
  try {
    const raw = window.localStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProgressView> | null;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      confessionArticles: parsed.confessionArticles ?? [],
      largerCatechism: parsed.largerCatechism ?? [],
      shorterCatechism: parsed.shorterCatechism ?? [],
      updatedAt: parsed.updatedAt ?? null,
      resume: parsed.resume ?? EMPTY_RESUME,
    };
  } catch {
    return null;
  }
}

function writeCache(userId: string, view: ProgressView) {
  try {
    window.localStorage.setItem(cacheKey(userId), JSON.stringify(view));
  } catch {
    // ignora erros de storage (modo privado, quota, etc.)
  }
}

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
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress>(EMPTY_PROGRESS);
  const [resume, setResume] = useState<ResumePosition>(EMPTY_RESUME);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const progressRef = useRef(progress);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !user) {
      setProgress(EMPTY_PROGRESS);
      setResume(EMPTY_RESUME);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY);
    }

    const cached = readCache(user.id);
    if (cached) {
      setProgress({
        confessionArticles: cached.confessionArticles,
        largerCatechism: cached.largerCatechism,
        shorterCatechism: cached.shorterCatechism,
      });
      setResume(cached.resume);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    let cancelled = false;
    setIsError(false);
    progressClient
      .getProgress()
      .then((data) => {
        if (cancelled) return;
        const view: ProgressView = {
          confessionArticles: data.confessionArticles ?? [],
          largerCatechism: data.largerCatechism ?? [],
          shorterCatechism: data.shorterCatechism ?? [],
          updatedAt: data.updatedAt ?? null,
          resume: data.resume ?? EMPTY_RESUME,
        };
        setProgress({
          confessionArticles: view.confessionArticles,
          largerCatechism: view.largerCatechism,
          shorterCatechism: view.shorterCatechism,
        });
        setResume(view.resume);
        writeCache(user.id, view);
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
  }, [isAuthenticated, isAuthLoading, user]);

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
        const view: ProgressView = {
          confessionArticles: result.confessionArticles ?? nextProgress.confessionArticles,
          largerCatechism: result.largerCatechism ?? nextProgress.largerCatechism,
          shorterCatechism: result.shorterCatechism ?? nextProgress.shorterCatechism,
          updatedAt: result.updatedAt ?? null,
          resume: result.resume ?? EMPTY_RESUME,
        };
        setProgress({
          confessionArticles: view.confessionArticles,
          largerCatechism: view.largerCatechism,
          shorterCatechism: view.shorterCatechism,
        });
        setResume(view.resume);
        if (userIdRef.current) writeCache(userIdRef.current, view);
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
    resume,
    isLoading,
    isError,
    isSyncing,
    toggleConfessionArticle,
    toggleLargerCatechism,
    toggleShorterCatechism,
  };
}
