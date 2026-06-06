import api from '@/services/api';

function buildQuery(searchParams: URLSearchParams): string {
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const documentsServices = {
  getConfession(searchParams: URLSearchParams, token?: string): Promise<Response> {
    return api.get(`/documents/confession${buildQuery(searchParams)}`, { token });
  },

  getLargerCatechism(searchParams: URLSearchParams, token?: string): Promise<Response> {
    return api.get(`/documents/catechism/larger${buildQuery(searchParams)}`, { token });
  },

  getShorterCatechism(searchParams: URLSearchParams, token?: string): Promise<Response> {
    return api.get(`/documents/catechism/shorter${buildQuery(searchParams)}`, { token });
  },

  searchDocuments(searchParams: URLSearchParams, token?: string): Promise<Response> {
    return api.get(`/documents/search${buildQuery(searchParams)}`, { token });
  },

  searchGlobal(searchParams: URLSearchParams, token?: string): Promise<Response> {
    return api.get(`/search${buildQuery(searchParams)}`, { token });
  },
};
