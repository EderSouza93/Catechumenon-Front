import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('POST /api/auth/register', () => {
  it('400 quando name/email/password ausentes', async () => {
    const res = await POST(
      makeRequest('/api/auth/register', { method: 'POST', body: { email: 'x@y' } }),
    );
    expect(res.status).toBe(400);
  });

  it('cria conta, seta cookie e devolve user', async () => {
    const res = await POST(
      makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'N', email: 'new@catechumenon.dev', password: 'pwpwpwpw' },
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/auth-token=mock-jwt-token/);
  });

  it('409 quando o backend reporta e-mail duplicado', async () => {
    const res = await POST(
      makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'N', email: 'duplicate@catechumenon.dev', password: 'x' },
      }),
    );
    expect(res.status).toBe(409);
    expect(((await readJson(res)) as { error: string }).error).toMatch(/já está em uso/);
  });

  it('400 com mensagem do backend quando validação falha', async () => {
    const res = await POST(
      makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'N', email: 'invalid@catechumenon.dev', password: 'x' },
      }),
    );
    expect(res.status).toBe(400);
    expect(((await readJson(res)) as { error: string }).error).toBe('Senha muito curta');
  });
});
