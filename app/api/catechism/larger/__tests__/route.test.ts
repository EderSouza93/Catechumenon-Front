import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { GET } from '@/app/api/catechism/larger/route';
import { server } from '@/tests/mocks/server';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('GET /api/catechism/larger', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/catechism/larger'));
    expect(res.status).toBe(401);
  });

  it('200 propaga o JSON do backend', async () => {
    server.use(
      http.get('http://backend.test/documents/catechism/larger', () =>
        HttpResponse.json({ items: [], total: 0, page: 1, limit: 10 }),
      ),
    );
    const res = await GET(makeRequest('/api/catechism/larger', { token: 'jwt' }));
    expect(res.status).toBe(200);
    expect((await readJson(res)) as { total: number }).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  });

  it('502 quando o backend cai', async () => {
    server.use(
      http.get('http://backend.test/documents/catechism/larger', () => HttpResponse.error()),
    );
    const res = await GET(makeRequest('/api/catechism/larger', { token: 'jwt' }));
    expect(res.status).toBe(502);
  });
});
