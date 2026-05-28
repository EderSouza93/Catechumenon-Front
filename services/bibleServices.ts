import api from '@/services/api';

export const bibleServices = {
  getReference(reference: string, token?: string): Promise<Response> {
    const qs = new URLSearchParams({ reference }).toString();
    return api.get(`/bible?${qs}`, { token });
  },
};
