import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { bibleServices } from '@/services/bibleServices';
import { server } from '@/tests/mocks/server';
import { mockBibleResponse } from '@/tests/mocks/fixtures/bible';

describe('bibleServices.getReference', () => {
  it('chama BACKEND_API_URL/bible com reference e Bearer token', async () => {
    let auth: string | null = null;
    let reference: string | null = null;
    server.use(
      http.get('http://backend.test/bible', ({ request }) => {
        auth = request.headers.get('authorization');
        reference = new URL(request.url).searchParams.get('reference');
        return HttpResponse.json(mockBibleResponse);
      }),
    );
    const res = await bibleServices.getReference('Sl 23:1', 'jwt-x');
    expect(res.status).toBe(200);
    expect(auth).toBe('Bearer jwt-x');
    expect(reference).toBe('Sl 23:1');
  });

  it('funciona sem token (chamadas internas)', async () => {
    let auth: string | null = 'sentinel';
    server.use(
      http.get('http://backend.test/bible', ({ request }) => {
        auth = request.headers.get('authorization');
        return HttpResponse.json(mockBibleResponse);
      }),
    );
    await bibleServices.getReference('Sl 1');
    expect(auth).toBeNull();
  });
});
