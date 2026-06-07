import { startMockBackend } from './mock-backend';

export default async function globalSetup(): Promise<void> {
  await startMockBackend();
}
