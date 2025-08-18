export interface ConfessionChapter {
  id: number;
  title: string;
  articles: Article[];
}

export interface Article {
  id: number;
  text: string;
  scriptureReferences?: string[];
}

export interface CatechismQuestion {
  id: number;
  question: string;
  answer: string;
  scriptureReferences?: string[];
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'book' | 'website' | 'audio';
}

export interface ReadingProgress {
  confessionChapters: number[];
  largerCatechism: number[];
  shorterCatechism: number[];
}