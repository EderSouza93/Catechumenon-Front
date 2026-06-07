import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { server } from '@/tests/mocks/server';
import { mockGlobalSearchResult } from '@/tests/mocks/fixtures/documents';
import { SearchSource } from '@/types';

describe('useGlobalSearch', () => {
  it('não dispara fetch sem 2+ chars', () => {
    let called = false;
    server.use(
      http.get('http://localhost/api/search', () => {
        called = true;
        return HttpResponse.json(mockGlobalSearchResult);
      }),
    );
    renderHook(() => useGlobalSearch({ q: ' ' }));
    expect(called).toBe(false);
  });

  it('busca com source=documents por padrão e popula resultados', async () => {
    let sourceParam: string | null = null;
    server.use(
      http.get('http://localhost/api/search', ({ request }) => {
        sourceParam = new URL(request.url).searchParams.get('source');
        return HttpResponse.json(mockGlobalSearchResult);
      }),
    );
    const { result } = renderHook(() => useGlobalSearch({ q: 'graça' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(sourceParam).toBe(SearchSource.Documents);
    expect(result.current.results).toEqual(mockGlobalSearchResult.results);
    expect(result.current.total).toBe(1);
  });

  it('respeita enabled=false', () => {
    let called = false;
    server.use(
      http.get('http://localhost/api/search', () => {
        called = true;
        return HttpResponse.json(mockGlobalSearchResult);
      }),
    );
    renderHook(() => useGlobalSearch({ q: 'graça', enabled: false }));
    expect(called).toBe(false);
  });

  it('marca isError em falha', async () => {
    server.use(
      http.get('http://localhost/api/search', () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHook(() => useGlobalSearch({ q: 'graça' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
