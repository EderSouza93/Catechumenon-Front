import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './tests/mocks/server';

vi.stubEnv('BACKEND_API_URL', 'http://backend.test');

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next-router-mock')>('next-router-mock');
  const router = actual.default;
  return {
    useRouter: () => router,
    usePathname: () => router.asPath.split('?')[0] || '/',
    useSearchParams: () => new URLSearchParams(router.query as Record<string, string>),
    useParams: () => router.query,
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
});

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: vi.fn(),
    themes: ['light', 'dark'],
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('sonner', () => {
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  });
  return {
    toast,
    Toaster: () => null,
  };
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
  window.localStorage.clear();
});

afterAll(() => {
  server.close();
});
