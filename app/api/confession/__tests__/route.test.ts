import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/confession/route';
import { makeRequest, readJson } from '@/tests/route-helpers';

describe('GET /api/confession', () => {
  it('401 sem token', async () => {
    const res = await GET(makeRequest('/api/confession'));
    expect(res.status).toBe(401);
  });

  it('200 com payload do backend', async () => {
    const res = await GET(makeRequest('/api/confession', { token: 'jwt' }));
    expect(res.status).toBe(200);
    expect((await readJson(res)) as { total: number }).toHaveProperty('total', 33);
  });
});
