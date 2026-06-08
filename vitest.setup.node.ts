import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './tests/mocks/server';

vi.stubEnv('BACKEND_API_URL', 'http://backend.test');

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
