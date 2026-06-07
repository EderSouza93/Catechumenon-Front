import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useLargerCatechism } from '@/hooks/useLargerCatechism';
import { server } from '@/tests/mocks/server';
import { mockLargerPage } from '@/tests/mocks/fixtures/documents';

describe('useLargerCatechism', () => {
  it('popula items e total após fetch', async () => {
    const { result } = renderHook(() => useLargerCatechism());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual(mockLargerPage.items);
    expect(result.current.total).toBe(196);
  });

  it('marca isError em falha', async () => {
    server.use(
      http.get('http://localhost/api/catechism/larger', () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHook(() => useLargerCatechism());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
