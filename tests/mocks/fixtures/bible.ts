import type { BibleApiResponse } from '@/types';

export const mockBibleResponse: BibleApiResponse = {
  reference: 'João 3:16',
  verses: [
    {
      book_id: 'JHN',
      book_name: 'João',
      chapter: 3,
      verse: 16,
      text: 'Porque Deus amou o mundo de tal maneira...',
    },
  ],
  text: 'Porque Deus amou o mundo de tal maneira...',
  translation_id: 'almeida',
  translation_name: 'João Ferreira de Almeida',
  translation_note: 'Texto livre',
};
