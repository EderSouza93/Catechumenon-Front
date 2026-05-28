import api from '@/services/api';
import type { ReadingProgress } from '@/types';

export type UpdateProgressPayload = Partial<ReadingProgress>;

export const progressServices = {
  getProgress(token?: string): Promise<Response> {
    return api.get('/progress', { token });
  },

  updateProgress(payload: UpdateProgressPayload, token?: string): Promise<Response> {
    return api.patch('/progress', {
      token,
      body: JSON.stringify(payload),
    });
  },
};
