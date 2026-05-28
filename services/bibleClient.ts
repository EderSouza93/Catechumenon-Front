import type { BibleApiResponse } from '@/types';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Falha ao consultar ${path} (status ${res.status})`);
  return (await res.json()) as T;
}

export const bibleClient = {
  getReference(reference: string): Promise<BibleApiResponse> {
    const qs = new URLSearchParams({ reference }).toString();
    return getJson<BibleApiResponse>(`/api/bible?${qs}`);
  },
};
