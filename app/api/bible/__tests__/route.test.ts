import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { GET } from '@/app/api/bible/route';
import { server } from '@/tests/mocks/server';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('GET /api/bible', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/bible', { searchParams: { reference: 'João 3:16' } }));
    expect(res.status).toBe(401);
  });

  it('400 sem query reference', async () => {
    const res = await GET(makeRequest('/api/bible', { token: 'jwt' }));
    expect(res.status).toBe(400);
  });

  it('200 proxando o body do backend', async () => {
    server.use(
      http.get('http://backend.test/bible', () =>
        HttpResponse.json({ reference: 'Sl 23:1', verses: [] }),
      ),
    );
    const res = await GET(
      makeRequest('/api/bible', { token: 'jwt', searchParams: { reference: 'Sl 23:1' } }),
    );
    expect(res.status).toBe(200);
    expect((await readJson(res)) as { reference: string }).toMatchObject({ reference: 'Sl 23:1' });
  });

  it('502 quando o backend lança erro de rede', async () => {
    server.use(
      http.get('http://backend.test/bible', () => HttpResponse.error()),
    );
    const res = await GET(
      makeRequest('/api/bible', { token: 'jwt', searchParams: { reference: 'X' } }),
    );
    expect(res.status).toBe(502);
  });
});
