'use client';

import { useState, useEffect } from 'react';
import { ReadingProgress } from '@/types';

export function useProgress() {
  const [progress, setProgress] = useState<ReadingProgress>({
    confessionChapters: [],
    largerCatechism: [],
    shorterCatechism: []
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem('westminster-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (newProgress: ReadingProgress) => {
    setProgress(newProgress);
    localStorage.setItem('westminster-progress', JSON.stringify(newProgress));
  };

  const markConfessionChapterAsRead = (chapterId: number) => {
    const newProgress = {
      ...progress,
      confessionChapters: progress.confessionChapters.includes(chapterId)
        ? progress.confessionChapters.filter(id => id !== chapterId)
        : [...progress.confessionChapters, chapterId]
    };
    updateProgress(newProgress);
  };

  const markLargerCatechismAsRead = (questionId: number) => {
    const newProgress = {
      ...progress,
      largerCatechism: progress.largerCatechism.includes(questionId)
        ? progress.largerCatechism.filter(id => id !== questionId)
        : [...progress.largerCatechism, questionId]
    };
    updateProgress(newProgress);
  };

  const markShorterCatechismAsRead = (questionId: number) => {
    const newProgress = {
      ...progress,
      shorterCatechism: progress.shorterCatechism.includes(questionId)
        ? progress.shorterCatechism.filter(id => id !== questionId)
        : [...progress.shorterCatechism, questionId]
    };
    updateProgress(newProgress);
  };

  return {
    progress,
    markConfessionChapterAsRead,
    markLargerCatechismAsRead,
    markShorterCatechismAsRead
  };
}