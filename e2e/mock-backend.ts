import { createServer, type Server } from 'node:http';
import { setupServer } from 'msw/node';
import { backendHandlers } from '../tests/mocks/handlers';

let httpServer: Server | null = null;
let mswServer: ReturnType<typeof setupServer> | null = null;

const MOCK_PORT = 4010;

export async function startMockBackend(): Promise<void> {
  mswServer = setupServer(...backendHandlers);
  mswServer.listen({ onUnhandledRequest: 'warn' });

  httpServer = createServer(async (req, res) => {
    const url = `http://backend.test${req.url ?? '/'}`;
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v);
      else if (Array.isArray(v)) headers.set(k, v.join(','));
    }
    try {
      const fetchRes = await fetch(url, {
        method: req.method,
        headers,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
      });
      res.statusCode = fetchRes.status;
      fetchRes.headers.forEach((value, name) => res.setHeader(name, value));
      const buffer = Buffer.from(await fetchRes.arrayBuffer());
      res.end(buffer);
    } catch (err) {
      res.statusCode = 502;
      res.end(JSON.stringify({ error: 'mock-backend-failure', detail: String(err) }));
    }
  });

  await new Promise<void>((resolve) => {
    httpServer!.listen(MOCK_PORT, '127.0.0.1', () => resolve());
  });
}

export async function stopMockBackend(): Promise<void> {
  await new Promise<void>((resolve) => {
    if (!httpServer) return resolve();
    httpServer.close(() => resolve());
  });
  mswServer?.close();
  httpServer = null;
  mswServer = null;
}
