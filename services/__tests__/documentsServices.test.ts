import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { documentsServices } from '@/services/documentsServices';
import { server } from '@/tests/mocks/server';

function captureGet(path: string) {
  let captured: URL | null = null;
  let auth: string | null = null;
  server.use(
    http.get(`http://backend.test${path}`, ({ request }) => {
      captured = new URL(request.url);
      auth = request.headers.get('authorization');
      return HttpResponse.json({ ok: true });
    }),
  );
  return () => ({ url: captured, auth });
}

describe('documentsServices', () => {
  it('getConfession encaminha searchParams', async () => {
    const get = captureGet('/documents/confession');
    const sp = new URLSearchParams({ page: '2', limit: '5' });
    await documentsServices.getConfession(sp, 'tk');
    const { url, auth } = get();
    expect(url!.pathname).toBe('/documents/confession');
    expect(url!.searchParams.get('page')).toBe('2');
    expect(url!.searchParams.get('limit')).toBe('5');
    expect(auth).toBe('Bearer tk');
  });

  it('getLargerCatechism sem params resulta em URL sem querystring', async () => {
    const get = captureGet('/documents/catechism/larger');
    await documentsServices.getLargerCatechism(new URLSearchParams(), 'tk');
    expect(get().url!.search).toBe('');
  });

  it('getShorterCatechism encaminha searchParams', async () => {
    const get = captureGet('/documents/catechism/shorter');
    await documentsServices.getShorterCatechism(new URLSearchParams({ page: '3' }), 'tk');
    expect(get().url!.searchParams.get('page')).toBe('3');
  });

  it('searchDocuments encaminha q e type', async () => {
    const get = captureGet('/documents/search');
    const sp = new URLSearchParams({ q: 'fé', type: 'confession' });
    await documentsServices.searchDocuments(sp, 'tk');
    const { url } = get();
    expect(url!.searchParams.get('q')).toBe('fé');
    expect(url!.searchParams.get('type')).toBe('confession');
  });

  it('searchGlobal chama /search', async () => {
    const get = captureGet('/search');
    await documentsServices.searchGlobal(new URLSearchParams({ q: 'fé' }), 'tk');
    expect(get().url!.pathname).toBe('/search');
  });
});
