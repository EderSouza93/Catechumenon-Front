import type {
  CatechismQuestion,
  ConfessionChapter,
  PaginatedResult,
  SearchDocumentType,
  SearchResult,
} from '@/types';

type PageParams = { page?: number; limit?: number };
type SearchParams = PageParams & { q: string; type?: SearchDocumentType };

function buildQuery(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Falha ao consultar ${path} (status ${res.status})`);
  return (await res.json()) as T;
}

export const documentsClient = {
  getConfession(params: PageParams = {}): Promise<PaginatedResult<ConfessionChapter>> {
    return getJson<PaginatedResult<ConfessionChapter>>(`/api/confession${buildQuery(params)}`);
  },

  getLargerCatechism(params: PageParams = {}): Promise<PaginatedResult<CatechismQuestion>> {
    return getJson<PaginatedResult<CatechismQuestion>>(
      `/api/catechism/larger${buildQuery(params)}`,
    );
  },

  getShorterCatechism(params: PageParams = {}): Promise<PaginatedResult<CatechismQuestion>> {
    return getJson<PaginatedResult<CatechismQuestion>>(
      `/api/catechism/shorter${buildQuery(params)}`,
    );
  },

  searchDocuments(params: SearchParams): Promise<SearchResult> {
    return getJson<SearchResult>(`/api/documents/search${buildQuery(params)}`);
  },
};
