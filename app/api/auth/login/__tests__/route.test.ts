import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { POST } from '@/app/api/auth/login/route';
import { server } from '@/tests/mocks/server';
import { makeRequest, readJson } from '@/tests/route-helpers';
import { mockAuthResponse } from '@/tests/mocks/fixtures/user';

describe('POST /api/auth/login', () => {
  it('retorna 400 quando email/password ausentes', async () => {
    const res = await POST(makeRequest('/api/auth/login', { method: 'POST', body: {} }));
    expect(res.status).toBe(400);
    expect((await readJson(res)) as { error: string }).toHaveProperty('error');
  });

  it('proxa para o backend, seta cookie httpOnly e devolve user', async () => {
    const res = await POST(
      makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'tester@catechumenon.dev', password: 'x' },
      }),
    );
    expect(res.status).toBe(200);
    const data = (await readJson(res)) as { success: boolean; user: { id: string } };
    expect(data.success).toBe(true);
    expect(data.user.id).toBe(mockAuthResponse.user.id);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toMatch(/auth-token=mock-jwt-token/);
    expect(setCookie).toMatch(/HttpOnly/i);
  });

  it('mapeia 401 do backend para credenciais inválidas', async () => {
    const res = await POST(
      makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'wrong@catechumenon.dev', password: 'x' },
      }),
    );
    expect(res.status).toBe(401);
    expect((await readJson(res)) as { error: string }).toEqual({
      success: false,
      error: 'Credenciais inválidas.',
    });
  });

  it('retorna 500 quando BACKEND_API_URL não está setado', async () => {
    const original = process.env.BACKEND_API_URL;
    process.env.BACKEND_API_URL = '';
    const res = await POST(
      makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'a@b', password: 'x' },
      }),
    );
    expect(res.status).toBe(500);
    process.env.BACKEND_API_URL = original;
  });

  it('propaga 5xx do backend genericamente', async () => {
    server.use(
      http.post('http://backend.test/auth/login', () => new HttpResponse(null, { status: 503 })),
    );
    const res = await POST(
      makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'a@b', password: 'x' },
      }),
    );
    expect(res.status).toBe(503);
  });
});
