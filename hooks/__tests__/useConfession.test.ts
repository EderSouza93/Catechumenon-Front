import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useConfession } from '@/hooks/useConfession';
import { server } from '@/tests/mocks/server';
import { mockConfessionPage } from '@/tests/mocks/fixtures/documents';

describe('useConfession', () => {
  it('inicia em loading e popula items + total após fetch', async () => {
    const { result } = renderHook(() => useConfession({ page: 1, limit: 3 }));
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual(mockConfessionPage.items);
    expect(result.current.total).toBe(mockConfessionPage.total);
    expect(result.current.isError).toBe(false);
  });

  it('marca isError quando o fetch falha', async () => {
    server.use(
      http.get('http://localhost/api/confession', () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHook(() => useConfession());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it('refaz fetch quando page muda', async () => {
    let lastPage: string | null = null;
    server.use(
      http.get('http://localhost/api/confession', ({ request }) => {
        lastPage = new URL(request.url).searchParams.get('page');
        return HttpResponse.json(mockConfessionPage);
      }),
    );
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useConfession({ page, limit: 3 }),
      { initialProps: { page: 1 } },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(lastPage).toBe('1');

    rerender({ page: 2 });
    await waitFor(() => expect(lastPage).toBe('2'));
  });
});
