import { User } from '../../../src/types';

// Mock Users (regular customers)
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'User@123',
    phone: '+1234567890',
    role: 'user',
    token: 'user-mock-token-1',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@123',
    phone: '+0987654321',
    role: 'user',
    token: 'user-mock-token-2',
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'User@123',
    phone: '+1122334455',
    role: 'user',
    token: 'user-mock-token-3',
  },
];
