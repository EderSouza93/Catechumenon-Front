import type { ProgressView, ReadingProgress } from '@/types';

export type UpdateProgressPayload = Partial<ReadingProgress>;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao consultar ${path} (status ${res.status})`);
  return (await res.json()) as T;
}

export const progressClient = {
  getProgress(): Promise<ProgressView> {
    return getJson<ProgressView>('/api/progress');
  },

  async updateProgress(payload: UpdateProgressPayload): Promise<ProgressView> {
    const res = await fetch('/api/progress', {
      method: 'PATCH',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Falha ao atualizar progresso (status ${res.status})`);
    }
    return (await res.json()) as ProgressView;
  },
};
