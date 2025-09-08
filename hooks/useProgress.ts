'use client';

import { useState, useEffect } from 'react';
import { ConfessionChapter, ReadingProgress } from '@/types';
import confessionData from '@/data/confession.json';

export function useProgress() {
  const [progress, setProgress] = useState<ReadingProgress>({
    confessionChapters: [],
    confessionSections: [],
    largerCatechism: [],
    shorterCatechism: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('westminster-progress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        if (
          parsedProgress.confessionChapters &&
          parsedProgress.confessionSections &&
          parsedProgress.largerCatechism &&
          parsedProgress.shorterCatechism
        ) {
          setProgress(parsedProgress);
        }
      }
    } catch (error) {
      console.error("Failed to parse progress from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAndSaveProgress = (newProgress: ReadingProgress) => {
    setProgress(newProgress);
    localStorage.setItem('westminster-progress', JSON.stringify(newProgress));
  };

  const toggleProgressItem = (
    key: 'largerCatechism' | 'shorterCatechism',
    questionId: number
  ) => {
    const list = progress[key];
    const newList = list.includes(questionId)
      ? list.filter(id => id !== questionId)
      : [...list, questionId];
    
    updateAndSaveProgress({ ...progress, [key]: newList });
  };

  const toggleConfessionSectionAsRead = (chapterId: number, articleId: number) => {
    const sectionKey = `${chapterId}-${articleId}`;
    const newSections = progress.confessionSections.includes(sectionKey)
      ? progress.confessionSections.filter(id => id !== sectionKey)
      : [...progress.confessionSections, sectionKey];

    const chapter = (confessionData as ConfessionChapter[]).find(c => c.id === chapterId);
    let newChapters = [...progress.confessionChapters];

    if (chapter) {
      const allArticlesInChapter = chapter.articles.map(a => `${chapter.id}-${a.id}`);
      const allArticlesRead = allArticlesInChapter.every(key => newSections.includes(key));

      if (allArticlesRead) {
        if (!newChapters.includes(chapterId)) {
          newChapters.push(chapterId);
        }
      } else {
        newChapters = newChapters.filter(id => id !== chapterId);
      }
    }
    
    updateAndSaveProgress({
      ...progress,
      confessionSections: newSections,
      confessionChapters: newChapters,
    });
  };

  return {
    progress,
    isLoading,
    toggleConfessionSectionAsRead,
    markLargerCatechismAsRead: (questionId: number) =>
      toggleProgressItem('largerCatechism', questionId),
    markShorterCatechismAsRead: (questionId: number) =>
      toggleProgressItem('shorterCatechism', questionId),
  };
}