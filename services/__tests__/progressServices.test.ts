import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { progressServices } from '@/services/progressServices';
import { server } from '@/tests/mocks/server';
import { mockProgressWithItems } from '@/tests/mocks/fixtures/progress';

describe('progressServices', () => {
  it('getProgress emite GET /progress com Bearer token', async () => {
    let auth: string | null = null;
    server.use(
      http.get('http://backend.test/progress', ({ request }) => {
        auth = request.headers.get('authorization');
        return HttpResponse.json(mockProgressWithItems);
      }),
    );
    const res = await progressServices.getProgress('jwt');
    expect(res.status).toBe(200);
    expect(auth).toBe('Bearer jwt');
  });

  it('updateProgress emite PATCH /progress com payload JSON', async () => {
    let captured: Request | null = null;
    server.use(
      http.patch('http://backend.test/progress', async ({ request }) => {
        captured = request.clone();
        return HttpResponse.json(mockProgressWithItems);
      }),
    );
    await progressServices.updateProgress({ largerCatechism: ['larger-1'] }, 'jwt');
    expect(captured!.method).toBe('PATCH');
    expect(captured!.headers.get('content-type')).toBe('application/json');
    expect(captured!.headers.get('authorization')).toBe('Bearer jwt');
    expect(await captured!.json()).toEqual({ largerCatechism: ['larger-1'] });
  });
});
