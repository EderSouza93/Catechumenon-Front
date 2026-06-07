import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useShorterCatechism } from '@/hooks/useShorterCatechism';
import { server } from '@/tests/mocks/server';
import { mockShorterPage } from '@/tests/mocks/fixtures/documents';

describe('useShorterCatechism', () => {
  it('popula items e total após fetch', async () => {
    const { result } = renderHook(() => useShorterCatechism());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual(mockShorterPage.items);
    expect(result.current.total).toBe(107);
  });

  it('marca isError em falha', async () => {
    server.use(
      http.get('http://localhost/api/catechism/shorter', () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHook(() => useShorterCatechism());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
