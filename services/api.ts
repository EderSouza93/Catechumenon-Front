export class BackendConfigError extends Error {
  constructor() {
    super('Configuração de backend ausente.');
    this.name = 'BackendConfigError';
  }
}

export function getBackendUrl(): string {
  const url = process.env.BACKEND_API_URL;
  if (!url) throw new BackendConfigError();
  return url;
}

type RequestOptions = RequestInit & { token?: string };

function buildHeaders(init?: RequestOptions): HeadersInit {
  const headers = new Headers(init?.headers);
  if (init?.token) headers.set('Authorization', `Bearer ${init.token}`);
  return headers;
}

const api = {
  get(path: string, init?: RequestOptions): Promise<Response> {
    return fetch(`${getBackendUrl()}${path}`, {
      method: 'GET',
      cache: 'no-store',
      ...init,
      headers: buildHeaders(init),
    });
  },
  patch(path: string, init?: RequestOptions): Promise<Response> {
    const headers = new Headers(buildHeaders(init));
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(`${getBackendUrl()}${path}`, {
      method: 'PATCH',
      cache: 'no-store',
      ...init,
      headers,
    });
  },
};

export default api;
