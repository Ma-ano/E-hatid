import { User } from '../../../src/types';

// Mock Admins
export const MOCK_ADMINS: (User & { password: string })[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    phone: '+9999999999',
    role: 'admin',
    token: 'admin-mock-token-1',
  },
  {
    id: 'admin-2',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'Admin@123',
    phone: '+8888888888',
    role: 'admin',
    token: 'admin-mock-token-2',
  },
];
