import type { ProgressView } from '@/types';

export const mockEmptyProgress: ProgressView = {
  confessionArticles: [],
  largerCatechism: [],
  shorterCatechism: [],
  updatedAt: null,
  resume: {
    shorterCatechism: null,
    largerCatechism: null,
    confession: null,
  },
};

export const mockProgressWithItems: ProgressView = {
  confessionArticles: ['conf-1-1'],
  largerCatechism: ['larger-1'],
  shorterCatechism: ['shorter-1'],
  updatedAt: '2026-06-01T12:00:00.000Z',
  resume: {
    shorterCatechism: { number: 2 },
    largerCatechism: { number: 2 },
    confession: { chapterNumber: 1, articleId: 'conf-1-2' },
  },
};
