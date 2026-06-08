import { NextRequest } from 'next/server';

type Options = {
  method?: string;
  body?: unknown;
  token?: string;
  searchParams?: Record<string, string>;
};

export function makeRequest(path: string, opts: Options = {}): NextRequest {
  const url = new URL(`http://localhost${path}`);
  if (opts.searchParams) {
    for (const [k, v] of Object.entries(opts.searchParams)) {
      url.searchParams.set(k, v);
    }
  }
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    headers: opts.token
      ? { cookie: `auth-token=${opts.token}`, 'content-type': 'application/json' }
      : { 'content-type': 'application/json' },
  };
  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
  }
  return new NextRequest(url, init as ConstructorParameters<typeof NextRequest>[1]);
}

export async function readJson(response: Response): Promise<unknown> {
  return JSON.parse(await response.text());
}
