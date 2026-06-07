import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/auth/me/route';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('GET /api/auth/me', () => {
  it('401 sem cookie auth-token', async () => {
    const res = await GET(makeRequest('/api/auth/me'));
    expect(res.status).toBe(401);
  });

  it('200 com user válido quando token é aceito pelo backend', async () => {
    const res = await GET(makeRequest('/api/auth/me', { token: 'mock-jwt-token' }));
    expect(res.status).toBe(200);
    const data = (await readJson(res)) as { success: boolean; user: { email: string } };
    expect(data.success).toBe(true);
    expect(data.user.email).toBe('tester@catechumenon.dev');
  });

  it('401 e cookie expirado quando token é rejeitado pelo backend', async () => {
    const res = await GET(makeRequest('/api/auth/me', { token: 'invalid' }));
    expect(res.status).toBe(401);
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toMatch(/auth-token=/);
    expect(setCookie).toMatch(/Max-Age=0/i);
  });
});
