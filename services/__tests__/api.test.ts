import { describe, expect, it, vi } from 'vitest';
import api, { BackendConfigError, getBackendUrl } from '@/services/api';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

describe('getBackendUrl', () => {
  it('retorna o valor de BACKEND_API_URL', () => {
    expect(getBackendUrl()).toBe('http://backend.test');
  });

  it('lança BackendConfigError se BACKEND_API_URL estiver ausente', () => {
    vi.stubEnv('BACKEND_API_URL', '');
    expect(() => getBackendUrl()).toThrow(BackendConfigError);
    vi.stubEnv('BACKEND_API_URL', 'http://backend.test');
  });
});

describe('api.get', () => {
  it('emite GET para BACKEND_API_URL + path', async () => {
    let captured: Request | null = null;
    server.use(
      http.get('http://backend.test/ping', ({ request }) => {
        captured = request;
        return HttpResponse.json({ ok: true });
      }),
    );
    const res = await api.get('/ping');
    expect(res.status).toBe(200);
    expect(captured).not.toBeNull();
    expect(new URL(captured!.url).pathname).toBe('/ping');
    expect(captured!.method).toBe('GET');
  });

  it('inclui o header Authorization quando token é fornecido', async () => {
    let authHeader: string | null = null;
    server.use(
      http.get('http://backend.test/secure', ({ request }) => {
        authHeader = request.headers.get('authorization');
        return HttpResponse.json({});
      }),
    );
    await api.get('/secure', { token: 'abc' });
    expect(authHeader).toBe('Bearer abc');
  });

  it('não inclui Authorization sem token', async () => {
    let authHeader: string | null = 'sentinel';
    server.use(
      http.get('http://backend.test/open', ({ request }) => {
        authHeader = request.headers.get('authorization');
        return HttpResponse.json({});
      }),
    );
    await api.get('/open');
    expect(authHeader).toBeNull();
  });
});

describe('api.patch', () => {
  it('emite PATCH com body JSON e Content-Type padrão', async () => {
    let captured: Request | null = null;
    server.use(
      http.patch('http://backend.test/resource', ({ request }) => {
        captured = request;
        return HttpResponse.json({ ok: true });
      }),
    );
    const res = await api.patch('/resource', {
      token: 'tk',
      body: JSON.stringify({ name: 'foo' }),
    });
    expect(res.status).toBe(200);
    expect(captured!.method).toBe('PATCH');
    expect(captured!.headers.get('content-type')).toBe('application/json');
    expect(captured!.headers.get('authorization')).toBe('Bearer tk');
    expect(await captured!.json()).toEqual({ name: 'foo' });
  });

  it('preserva Content-Type explícito do chamador', async () => {
    let contentType: string | null = null;
    server.use(
      http.patch('http://backend.test/custom', ({ request }) => {
        contentType = request.headers.get('content-type');
        return HttpResponse.json({});
      }),
    );
    await api.patch('/custom', {
      body: 'raw',
      headers: { 'Content-Type': 'text/plain' },
    });
    expect(contentType).toBe('text/plain');
  });
});
