import { MOCK_USERS } from '@/data/mock-users';
import { User } from '@/types';

export function getUserFromToken(token: string | undefined): User | null {
  if (!token) return null;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const record = MOCK_USERS.find((u) => u.user.id === decoded.id);
    return record?.user ?? null;
  } catch {
    return null;
  }
}
