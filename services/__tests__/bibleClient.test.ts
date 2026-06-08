import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { bibleClient } from '@/services/bibleClient';
import { server } from '@/tests/mocks/server';
import { mockBibleResponse } from '@/tests/mocks/fixtures/bible';

describe('bibleClient.getReference', () => {
  it('chama /api/bible com query reference codificada', async () => {
    let url: URL | null = null;
    server.use(
      http.get('http://localhost/api/bible', ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json(mockBibleResponse);
      }),
    );
    const data = await bibleClient.getReference('João 3:16');
    expect(url!.pathname).toBe('/api/bible');
    expect(url!.searchParams.get('reference')).toBe('João 3:16');
    expect(data.reference).toBe('João 3:16');
  });

  it('lança erro quando o response não está ok', async () => {
    server.use(
      http.get('http://localhost/api/bible', () => new HttpResponse(null, { status: 502 })),
    );
    await expect(bibleClient.getReference('X')).rejects.toThrow(/status 502/);
  });
});
