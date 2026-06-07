import { http, HttpResponse } from 'msw';
import { mockBibleResponse } from './fixtures/bible';
import {
  mockConfessionPage,
  mockDocumentsSearchResult,
  mockGlobalSearchResult,
  mockLargerPage,
  mockShorterPage,
} from './fixtures/documents';
import { mockEmptyProgress } from './fixtures/progress';
import { mockAuthResponse, mockUser } from './fixtures/user';

const BACKEND = 'http://backend.test';

export const backendHandlers = [
  http.post(`${BACKEND}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'wrong@catechumenon.dev') {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${BACKEND}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    if (body.email === 'duplicate@catechumenon.dev') {
      return new HttpResponse(null, { status: 409 });
    }
    if (body.email === 'invalid@catechumenon.dev') {
      return HttpResponse.json({ message: ['Senha muito curta'] }, { status: 400 });
    }
    return HttpResponse.json(mockAuthResponse);
  }),

  http.get(`${BACKEND}/auth/me`, ({ request }) => {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.includes('mock-jwt-token')) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(mockUser);
  }),

  http.get(`${BACKEND}/bible`, ({ request }) => {
    const url = new URL(request.url);
    const reference = url.searchParams.get('reference');
    return HttpResponse.json({ ...mockBibleResponse, reference });
  }),

  http.get(`${BACKEND}/documents/confession`, () => HttpResponse.json(mockConfessionPage)),
  http.get(`${BACKEND}/documents/catechism/larger`, () => HttpResponse.json(mockLargerPage)),
  http.get(`${BACKEND}/documents/catechism/shorter`, () => HttpResponse.json(mockShorterPage)),
  http.get(`${BACKEND}/documents/search`, () => HttpResponse.json(mockDocumentsSearchResult)),
  http.get(`${BACKEND}/search`, () => HttpResponse.json(mockGlobalSearchResult)),

  http.get(`${BACKEND}/progress`, () => HttpResponse.json(mockEmptyProgress)),
  http.patch(`${BACKEND}/progress`, async ({ request }) => {
    const payload = (await request.json()) as Record<string, string[]>;
    return HttpResponse.json({
      ...mockEmptyProgress,
      ...payload,
      updatedAt: '2026-06-07T12:00:00.000Z',
    });
  }),
];

export const apiHandlers = [
  http.post('http://localhost/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'wrong@catechumenon.dev') {
      return HttpResponse.json(
        { success: false, error: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }
    return HttpResponse.json({ success: true, user: mockUser });
  }),

  http.post('http://localhost/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string };
    if (body.email === 'duplicate@catechumenon.dev') {
      return HttpResponse.json(
        { success: false, error: 'Este e-mail já está em uso.' },
        { status: 409 },
      );
    }
    return HttpResponse.json({ success: true, user: mockUser });
  }),

  http.post('http://localhost/api/auth/logout', () =>
    HttpResponse.json({ success: true }),
  ),

  http.get('http://localhost/api/auth/me', () =>
    HttpResponse.json({ success: true, user: mockUser }),
  ),

  http.get('http://localhost/api/bible', ({ request }) => {
    const url = new URL(request.url);
    const reference = url.searchParams.get('reference');
    return HttpResponse.json({ ...mockBibleResponse, reference });
  }),

  http.get('http://localhost/api/confession', () => HttpResponse.json(mockConfessionPage)),
  http.get('http://localhost/api/catechism/larger', () => HttpResponse.json(mockLargerPage)),
  http.get('http://localhost/api/catechism/shorter', () => HttpResponse.json(mockShorterPage)),
  http.get('http://localhost/api/documents/search', () =>
    HttpResponse.json(mockDocumentsSearchResult),
  ),
  http.get('http://localhost/api/search', () => HttpResponse.json(mockGlobalSearchResult)),

  http.get('http://localhost/api/progress', () => HttpResponse.json(mockEmptyProgress)),
  http.patch('http://localhost/api/progress', async ({ request }) => {
    const payload = (await request.json()) as Record<string, string[]>;
    return HttpResponse.json({
      ...mockEmptyProgress,
      ...payload,
      updatedAt: '2026-06-07T12:00:00.000Z',
    });
  }),
];

export const handlers = [...backendHandlers, ...apiHandlers];
