import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { GET } from '@/app/api/search/route';
import { server } from '@/tests/mocks/server';
import { makeRequest } from '@/tests/route-helpers';

describe('GET /api/search', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/search'));
    expect(res.status).toBe(401);
  });

  it('propaga searchParams para /search no backend', async () => {
    let backendUrl: URL | null = null;
    server.use(
      http.get('http://backend.test/search', ({ request }) => {
        backendUrl = new URL(request.url);
        return HttpResponse.json({ results: [], total: 0 });
      }),
    );
    const res = await GET(
      makeRequest('/api/search', {
        token: 'jwt',
        searchParams: { q: 'graça', source: 'documents' },
      }),
    );
    expect(res.status).toBe(200);
    expect(backendUrl!.searchParams.get('q')).toBe('graça');
    expect(backendUrl!.searchParams.get('source')).toBe('documents');
  });
});
