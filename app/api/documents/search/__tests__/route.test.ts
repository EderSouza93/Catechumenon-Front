import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { GET } from '@/app/api/documents/search/route';
import { server } from '@/tests/mocks/server';
import { makeRequest } from '@/tests/route-helpers';

describe('GET /api/documents/search', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/documents/search'));
    expect(res.status).toBe(401);
  });

  it('propaga searchParams para o backend', async () => {
    let backendUrl: URL | null = null;
    server.use(
      http.get('http://backend.test/documents/search', ({ request }) => {
        backendUrl = new URL(request.url);
        return HttpResponse.json({ results: [], total: 0 });
      }),
    );
    const res = await GET(
      makeRequest('/api/documents/search', {
        token: 'jwt',
        searchParams: { q: 'graça', type: 'confession' },
      }),
    );
    expect(res.status).toBe(200);
    expect(backendUrl!.searchParams.get('q')).toBe('graça');
    expect(backendUrl!.searchParams.get('type')).toBe('confession');
  });
});
