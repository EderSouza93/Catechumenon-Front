import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { progressClient } from '@/services/progressClient';
import { server } from '@/tests/mocks/server';
import { mockProgressWithItems } from '@/tests/mocks/fixtures/progress';

describe('progressClient', () => {
  it('getProgress retorna o ProgressView do endpoint', async () => {
    server.use(
      http.get('http://localhost/api/progress', () => HttpResponse.json(mockProgressWithItems)),
    );
    const data = await progressClient.getProgress();
    expect(data.confessionArticles).toEqual(['conf-1-1']);
    expect(data.resume.confession?.chapterNumber).toBe(1);
  });

  it('getProgress propaga erro com status quando não ok', async () => {
    server.use(
      http.get('http://localhost/api/progress', () => new HttpResponse(null, { status: 401 })),
    );
    await expect(progressClient.getProgress()).rejects.toThrow(/status 401/);
  });

  it('updateProgress envia PATCH com body JSON', async () => {
    let captured: Request | null = null;
    server.use(
      http.patch('http://localhost/api/progress', async ({ request }) => {
        captured = request.clone();
        return HttpResponse.json(mockProgressWithItems);
      }),
    );
    await progressClient.updateProgress({ confessionArticles: ['x'] });
    expect(captured!.method).toBe('PATCH');
    expect(captured!.headers.get('content-type')).toBe('application/json');
    expect(await captured!.json()).toEqual({ confessionArticles: ['x'] });
  });

  it('updateProgress lança erro quando o servidor falha', async () => {
    server.use(
      http.patch('http://localhost/api/progress', () => new HttpResponse(null, { status: 500 })),
    );
    await expect(progressClient.updateProgress({ confessionArticles: [] })).rejects.toThrow(
      /status 500/,
    );
  });
});
