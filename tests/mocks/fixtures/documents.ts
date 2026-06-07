import type {
  CatechismQuestion,
  ConfessionChapter,
  GlobalSearchResult,
  PaginatedResult,
  SearchResult,
} from '@/types';
import { SearchResultType, SearchSource } from '@/types';

export const mockConfessionChapter: ConfessionChapter = {
  id: 'conf-1',
  number: 1,
  title: 'Das Sagradas Escrituras',
  articles: [
    {
      id: 'conf-1-1',
      number: 1,
      text: 'A luz da natureza e as obras da criação...',
      bibleRefs: ['Rm 1:19-20', 'Sl 19:1-3'],
      sections: null,
    },
    {
      id: 'conf-1-2',
      number: 2,
      text: 'Debaixo do nome de Sagrada Escritura...',
      bibleRefs: ['2 Tm 3:16'],
      sections: null,
    },
  ],
};

export const mockConfessionPage: PaginatedResult<ConfessionChapter> = {
  items: [mockConfessionChapter],
  total: 33,
  page: 1,
  limit: 3,
};

export const mockLargerQuestion: CatechismQuestion = {
  id: 'larger-1',
  number: 1,
  question: 'Qual é o principal e mais elevado fim do homem?',
  answer: 'O principal e mais elevado fim do homem é glorificar a Deus...',
  bibleRefs: ['Rm 11:36', '1 Co 10:31'],
};

export const mockLargerPage: PaginatedResult<CatechismQuestion> = {
  items: [mockLargerQuestion],
  total: 196,
  page: 1,
  limit: 10,
};

export const mockShorterQuestion: CatechismQuestion = {
  id: 'shorter-1',
  number: 1,
  question: 'Qual o fim principal do homem?',
  answer: 'O fim principal do homem é glorificar a Deus...',
  bibleRefs: ['1 Co 10:31'],
};

export const mockShorterPage: PaginatedResult<CatechismQuestion> = {
  items: [mockShorterQuestion],
  total: 107,
  page: 1,
  limit: 10,
};

export const mockDocumentsSearchResult: SearchResult = {
  query: 'graça',
  total: 1,
  page: 1,
  limit: 10,
  results: [
    {
      type: SearchResultType.ConfessionArticle,
      id: 'conf-7-2',
      chapterNumber: 7,
      articleNumber: 2,
      snippet: 'Pela <mark>graça</mark> de Deus...',
      rank: 0.95,
    },
  ],
};

export const mockGlobalSearchResult: GlobalSearchResult = {
  query: 'graça',
  total: 1,
  page: 1,
  limit: 20,
  results: [
    {
      source: SearchSource.Documents,
      type: SearchResultType.ConfessionArticle,
      id: 'conf-7-2',
      title: 'Confissão 7.2',
      snippet: 'Pela <mark>graça</mark> de Deus...',
      rank: 0.95,
      ref: { chapterNumber: 7, articleNumber: 2 },
    },
  ],
};
