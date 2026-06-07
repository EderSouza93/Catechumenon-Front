import { stopMockBackend } from './mock-backend';

export default async function globalTeardown(): Promise<void> {
  await stopMockBackend();
}
