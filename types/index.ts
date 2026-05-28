export interface ConfessionChapter {
  id: string;
  number: number;
  title: string;
  articles: ConfessionArticle[];
}

export interface ConfessionArticle {
  id: string;
  number: number;
  text: string;
  bibleRefs: string[];
  sections?: ConfessionArticleSection[] | null;
}

export interface ConfessionArticleSection {
  title: string;
  items: string[];
}

export interface CatechismQuestion {
  id: string;
  number: number;
  question: string;
  answer: string;
  bibleRefs: string[];
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'book' | 'website' | 'audio';
}

export interface ReadingProgress {
  confessionArticles: string[];
  largerCatechism: string[];
  shorterCatechism: string[];
}

export interface ProgressView extends ReadingProgress {
  updatedAt: string | null;
}

export type ProgressCollection = keyof ReadingProgress;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export enum SearchDocumentType {
  Confession = 'confession',
  Larger = 'larger',
  Shorter = 'shorter',
}

export enum SearchResultType {
  ConfessionArticle = 'confession_article',
  LargerCatechism = 'larger_catechism',
  ShorterCatechism = 'shorter_catechism',
}

export type SearchResultItem =
  | {
      type: SearchResultType.ConfessionArticle;
      id: string;
      chapterNumber: number;
      articleNumber: number;
      snippet: string;
      rank: number;
    }
  | {
      type: SearchResultType.LargerCatechism | SearchResultType.ShorterCatechism;
      id: string;
      number: number;
      snippet: string;
      rank: number;
    };

export interface SearchResult {
  query: string;
  total: number;
  page: number;
  limit: number;
  results: SearchResultItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: User;
}

export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}
