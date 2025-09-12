"use client";

import { useState, useCallback } from 'react';

interface BibleApiResponse {
  reference: string;
  verses: Array<{ book_id: string; book_name: string; chapter: number; verse: number; text: string; }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

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
      const response = await fetch(`/api/bible?reference=${encodeURIComponent(reference)}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar o versículo.');
      }
      const data: BibleApiResponse = await response.json();
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