import { User } from '@/types';

interface MockUserRecord {
  user: User;
  password: string;
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    user: {
      id: 'usr_1a2b3c4d',
      name: 'Administrador',
      email: 'admin@catechumenon.com',
      role: 'admin',
    },
    password: '123456',
  },
  {
    user: {
      id: 'usr_5e6f7g8h',
      name: 'Estudante',
      email: 'estudante@catechumenon.com',
      role: 'user',
    },
    password: '123456',
  },
];
