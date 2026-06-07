import type { BackendAuthResponse, User } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Tester Catechumenon',
  email: 'tester@catechumenon.dev',
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockAuthResponse: BackendAuthResponse = {
  accessToken: 'mock-jwt-token',
  user: mockUser,
};

export const mockCredentials = {
  email: 'tester@catechumenon.dev',
  password: 'tester1234',
};

export const mockRegisterCredentials = {
  name: 'Tester Catechumenon',
  email: 'tester@catechumenon.dev',
  password: 'tester1234',
};
