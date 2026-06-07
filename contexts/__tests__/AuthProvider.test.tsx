import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { server } from '@/tests/mocks/server';
import { mockUser } from '@/tests/mocks/fixtures/user';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('lança quando usado fora do AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
    consoleError.mockRestore();
  });
});

describe('AuthProvider', () => {
  it('inicializa em loading e popula user a partir de /api/auth/me', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: true, user: mockUser }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(mockUser.email);
  });

  it('mantém user=null quando /api/auth/me retorna 401', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: false, user: null }, { status: 401 }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login(true) seta user e retorna success', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: false, user: null }, { status: 401 }),
      ),
      http.post('http://localhost/api/auth/login', () =>
        HttpResponse.json({ success: true, user: mockUser }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response: { success: boolean; error?: string } = { success: false };
    await act(async () => {
      response = await result.current.login({ email: 'a@b', password: 'x' });
    });
    expect(response.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login(401) devolve success=false com mensagem do backend', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: false, user: null }, { status: 401 }),
      ),
      http.post('http://localhost/api/auth/login', () =>
        HttpResponse.json({ success: false, error: 'Credenciais inválidas.' }, { status: 401 }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response: { success: boolean; error?: string } = { success: true };
    await act(async () => {
      response = await result.current.login({ email: 'a@b', password: 'x' });
    });
    expect(response.success).toBe(false);
    expect(response.error).toBe('Credenciais inválidas.');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('register(true) seta user', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: false, user: null }, { status: 401 }),
      ),
      http.post('http://localhost/api/auth/register', () =>
        HttpResponse.json({ success: true, user: mockUser }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register({ name: 'N', email: 'a@b', password: 'x' });
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout zera user e chama /api/auth/logout', async () => {
    server.use(
      http.get('http://localhost/api/auth/me', () =>
        HttpResponse.json({ success: true, user: mockUser }),
      ),
    );
    let logoutHit = false;
    server.use(
      http.post('http://localhost/api/auth/logout', () => {
        logoutHit = true;
        return HttpResponse.json({ success: true });
      }),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });
    expect(logoutHit).toBe(true);
    expect(result.current.user).toBeNull();
  });
});
