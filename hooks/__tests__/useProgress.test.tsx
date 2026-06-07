import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthProvider';
import {
  countCompletedConfessionChapters,
  useProgress,
} from '@/hooks/useProgress';
import { server } from '@/tests/mocks/server';
import { mockProgressWithItems } from '@/tests/mocks/fixtures/progress';
import type { ConfessionChapter, ProgressView } from '@/types';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const authenticated = () => {
  server.use(
    http.get('http://localhost/api/auth/me', () =>
      HttpResponse.json({
        success: true,
        user: {
          id: 'user-1',
          name: 'Tester',
          email: 't@x.dev',
          role: 'user',
          createdAt: '',
          updatedAt: '',
        },
      }),
    ),
  );
};

const unauthenticated = () => {
  server.use(
    http.get('http://localhost/api/auth/me', () =>
      HttpResponse.json({ success: false, user: null }, { status: 401 }),
    ),
  );
};

describe('countCompletedConfessionChapters', () => {
  const chapters: ConfessionChapter[] = [
    {
      id: 'c1',
      number: 1,
      title: 'A',
      articles: [
        { id: 'c1-1', number: 1, text: '', bibleRefs: [], sections: null },
        { id: 'c1-2', number: 2, text: '', bibleRefs: [], sections: null },
      ],
    },
    {
      id: 'c2',
      number: 2,
      title: 'B',
      articles: [{ id: 'c2-1', number: 1, text: '', bibleRefs: [], sections: null }],
    },
  ];

  it('retorna 0 quando não há capítulos', () => {
    expect(countCompletedConfessionChapters([], [])).toBe(0);
  });

  it('conta apenas capítulos com TODOS os artigos lidos', () => {
    expect(countCompletedConfessionChapters(['c1-1', 'c2-1'], chapters)).toBe(1);
    expect(countCompletedConfessionChapters(['c1-1', 'c1-2', 'c2-1'], chapters)).toBe(2);
  });

  it('ignora capítulos sem artigos', () => {
    const empty: ConfessionChapter = {
      id: 'c3',
      number: 3,
      title: 'C',
      articles: [],
    };
    expect(countCompletedConfessionChapters([], [empty])).toBe(0);
  });
});

describe('useProgress', () => {
  it('quando não autenticado, mantém progresso vazio e sai de loading', async () => {
    unauthenticated();
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.progress.confessionArticles).toEqual([]);
    expect(result.current.progress.largerCatechism).toEqual([]);
    expect(result.current.progress.shorterCatechism).toEqual([]);
  });

  it('quando autenticado, carrega o progresso do servidor', async () => {
    authenticated();
    server.use(
      http.get('http://localhost/api/progress', () => HttpResponse.json(mockProgressWithItems)),
    );

    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() =>
      expect(result.current.progress.confessionArticles).toEqual(['conf-1-1']),
    );
    expect(result.current.resume.confession?.chapterNumber).toBe(1);
  });

  it('cacheia o ProgressView em localStorage por userId', async () => {
    authenticated();
    server.use(
      http.get('http://localhost/api/progress', () => HttpResponse.json(mockProgressWithItems)),
    );
    renderHook(() => useProgress(), { wrapper });
    await waitFor(() => {
      const raw = window.localStorage.getItem('catechumenon:progress:user-1');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as ProgressView;
      expect(parsed.confessionArticles).toEqual(['conf-1-1']);
    });
  });

  it('lê o cache antes do fetch e atualiza após resposta', async () => {
    authenticated();
    window.localStorage.setItem(
      'catechumenon:progress:user-1',
      JSON.stringify({
        confessionArticles: ['cached'],
        largerCatechism: [],
        shorterCatechism: [],
        updatedAt: '2026-01-01T00:00:00.000Z',
        resume: { shorterCatechism: null, largerCatechism: null, confession: null },
      }),
    );
    server.use(
      http.get('http://localhost/api/progress', () => HttpResponse.json(mockProgressWithItems)),
    );

    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() =>
      expect(result.current.progress.confessionArticles).toEqual(['conf-1-1']),
    );
  });

  it('toggle adiciona/remove ids e chama PATCH /api/progress', async () => {
    authenticated();
    const patched: unknown[] = [];
    server.use(
      http.get('http://localhost/api/progress', () =>
        HttpResponse.json({
          ...mockProgressWithItems,
          confessionArticles: [],
        }),
      ),
      http.patch('http://localhost/api/progress', async ({ request }) => {
        const body = await request.json();
        patched.push(body);
        return HttpResponse.json({
          ...mockProgressWithItems,
          confessionArticles: ['conf-1-1'],
        });
      }),
    );

    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleConfessionArticle('conf-1-1');
    });

    expect(patched).toEqual([{ confessionArticles: ['conf-1-1'] }]);
    expect(result.current.progress.confessionArticles).toEqual(['conf-1-1']);
  });

  it('faz rollback do estado se PATCH falhar', async () => {
    authenticated();
    server.use(
      http.get('http://localhost/api/progress', () =>
        HttpResponse.json({
          ...mockProgressWithItems,
          largerCatechism: [],
        }),
      ),
      http.patch('http://localhost/api/progress', () => new HttpResponse(null, { status: 500 })),
    );

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useProgress(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleLargerCatechism('larger-1');
    });

    expect(result.current.progress.largerCatechism).toEqual([]);
    expect(result.current.isError).toBe(true);
    consoleError.mockRestore();
  });
});
