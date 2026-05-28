"use client";

import { useState, useCallback } from 'react';
import { bibleClient } from '@/services/bibleClient';

export function useVerseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [verseTitle, setVerseTitle] = useState("");
  const [verseContent, setVerseContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = useCallback(async (reference: string) => {
    setVerseTitle(reference);
    setIsOpen(true);
    setIsLoading(true);
    setVerseContent(null);

    try {
      const data = await bibleClient.getReference(reference);
      setVerseContent(data.text);
    } catch (error) {
      console.error(error);
      setVerseContent('Não foi possível carregar o texto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setVerseTitle("");
    setVerseContent(null);
  }, []);

  return {
    isOpen,
    verseTitle,
    verseContent,
    isLoading,
    openDialog,
    closeDialog,
  };
}
