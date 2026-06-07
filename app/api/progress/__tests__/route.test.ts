import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { GET, PATCH } from '@/app/api/progress/route';
import { server } from '@/tests/mocks/server';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('GET /api/progress', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/progress'));
    expect(res.status).toBe(401);
  });

  it('200 com ProgressView do backend', async () => {
    const res = await GET(makeRequest('/api/progress', { token: 'jwt' }));
    expect(res.status).toBe(200);
    const data = (await readJson(res)) as { confessionArticles: string[] };
    expect(Array.isArray(data.confessionArticles)).toBe(true);
  });
});

describe('PATCH /api/progress', () => {
  it('401 sem token', async () => {
    const res = await PATCH(makeRequest('/api/progress', { method: 'PATCH', body: {} }));
    expect(res.status).toBe(401);
  });

  it('400 com payload JSON inválido', async () => {
    const res = await PATCH(
      makeRequest('/api/progress', { method: 'PATCH', token: 'jwt', body: 'not-json' }),
    );
    expect(res.status).toBe(400);
  });

  it('proxa o payload para PATCH /progress no backend', async () => {
    let body: unknown = null;
    server.use(
      http.patch('http://backend.test/progress', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ confessionArticles: ['x'] });
      }),
    );
    const res = await PATCH(
      makeRequest('/api/progress', {
        method: 'PATCH',
        token: 'jwt',
        body: { confessionArticles: ['x'] },
      }),
    );
    expect(res.status).toBe(200);
    expect(body).toEqual({ confessionArticles: ['x'] });
  });
});
