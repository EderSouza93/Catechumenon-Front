import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useDocumentsSearch } from '@/hooks/useDocumentsSearch';
import { server } from '@/tests/mocks/server';
import { mockDocumentsSearchResult } from '@/tests/mocks/fixtures/documents';
import { SearchDocumentType } from '@/types';

describe('useDocumentsSearch', () => {
  it('não faz fetch enquanto a query tiver menos de 2 caracteres', () => {
    let called = false;
    server.use(
      http.get('http://localhost/api/documents/search', () => {
        called = true;
        return HttpResponse.json(mockDocumentsSearchResult);
      }),
    );
    const { result } = renderHook(() => useDocumentsSearch({ q: 'a' }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(called).toBe(false);
  });

  it('respeita enabled=false', () => {
    let called = false;
    server.use(
      http.get('http://localhost/api/documents/search', () => {
        called = true;
        return HttpResponse.json(mockDocumentsSearchResult);
      }),
    );
    renderHook(() => useDocumentsSearch({ q: 'graça', enabled: false }));
    expect(called).toBe(false);
  });

  it('busca quando q tem 2+ chars e popula results/total', async () => {
    const { result } = renderHook(() =>
      useDocumentsSearch({ q: 'graça', type: SearchDocumentType.Confession }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.results).toEqual(mockDocumentsSearchResult.results);
    expect(result.current.total).toBe(1);
  });

  it('marca isError em falha de rede', async () => {
    server.use(
      http.get('http://localhost/api/documents/search', () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHook(() => useDocumentsSearch({ q: 'graça' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
