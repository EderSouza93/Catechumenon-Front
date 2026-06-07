import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { documentsClient } from '@/services/documentsClient';
import { server } from '@/tests/mocks/server';
import { SearchDocumentType, SearchSource } from '@/types';
import {
  mockConfessionPage,
  mockDocumentsSearchResult,
  mockGlobalSearchResult,
  mockLargerPage,
  mockShorterPage,
} from '@/tests/mocks/fixtures/documents';

describe('documentsClient', () => {
  it('getConfession monta querystring com page e limit', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/confession', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockConfessionPage);
      }),
    );
    await documentsClient.getConfession({ page: 2, limit: 5 });
    expect(url!.searchParams.get('page')).toBe('2');
    expect(url!.searchParams.get('limit')).toBe('5');
  });

  it('getConfession sem params não emite querystring', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/confession', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockConfessionPage);
      }),
    );
    await documentsClient.getConfession();
    expect(url!.search).toBe('');
  });

  it('getLargerCatechism chega no endpoint correto', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/catechism/larger', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockLargerPage);
      }),
    );
    const data = await documentsClient.getLargerCatechism({ page: 1 });
    expect(url!.pathname).toBe('/api/catechism/larger');
    expect(data.total).toBe(196);
  });

  it('getShorterCatechism chega no endpoint correto', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/catechism/shorter', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockShorterPage);
      }),
    );
    await documentsClient.getShorterCatechism();
    expect(url!.pathname).toBe('/api/catechism/shorter');
  });

  it('searchDocuments propaga q e type', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/documents/search', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockDocumentsSearchResult);
      }),
    );
    await documentsClient.searchDocuments({
      q: 'graça',
      type: SearchDocumentType.Confession,
    });
    expect(url!.searchParams.get('q')).toBe('graça');
    expect(url!.searchParams.get('type')).toBe('confession');
  });

  it('searchGlobal injeta source=documents por padrão', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/search', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockGlobalSearchResult);
      }),
    );
    await documentsClient.searchGlobal({ q: 'graça' });
    expect(url!.searchParams.get('source')).toBe(SearchSource.Documents);
  });

  it('lança erro com status quando o response não está ok', async () => {
    server.use(
      http.get('http://localhost/api/confession', () => new HttpResponse(null, { status: 500 })),
    );
    await expect(documentsClient.getConfession()).rejects.toThrow(/status 500/);
  });

  it('buildQuery (indireto) ignora valores undefined e vazios', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/documents/search', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockDocumentsSearchResult);
      }),
    );
    await documentsClient.searchDocuments({ q: 'x', type: undefined, page: 1 });
    expect(url!.searchParams.has('type')).toBe(false);
    expect(url!.searchParams.get('page')).toBe('1');
  });
});
