import type { UserRole } from '../../../src/types/auth';

// Mock Credentials for all roles
export const MOCK_CREDENTIALS: Record<UserRole, { email: string; password: string }[]> = {
  user: [
    { email: 'user@example.com', password: 'User@123' },
    { email: 'jane@example.com', password: 'User@123' },
    { email: 'mike@example.com', password: 'User@123' },
  ],
  rider: [
    { email: 'rider@example.com', password: 'Rider@123' },
    { email: 'rider2@example.com', password: 'Rider@123' },
    { email: 'rider3@example.com', password: 'Rider@123' },
  ],
  admin: [
    { email: 'admin@example.com', password: 'Admin@123' },
    { email: 'superadmin@example.com', password: 'Admin@123' },
  ],
  vendor: [
    { email: 'vendor@pizza.com', password: 'Vendor@123' },
    { email: 'vendor@burger.com', password: 'Vendor@123' },
  ],
  guest: [],
};

// Combined credentials for reference
export const ALL_CREDENTIALS = [
  {
    category: 'User Login',
    credentials: [
      { email: 'user@example.com', password: 'User@123' },
      { email: 'jane@example.com', password: 'User@123' },
      { email: 'mike@example.com', password: 'User@123' },
    ],
  },
  {
    category: 'Rider Login',
    credentials: [
      { email: 'rider@example.com', password: 'Rider@123', status: 'approved' },
      { email: 'rider2@example.com', password: 'Rider@123', status: 'approved' },
      { email: 'rider3@example.com', password: 'Rider@123', status: 'pending' },
    ],
  },
  {
    category: 'Admin Login',
    credentials: [
      { email: 'admin@example.com', password: 'Admin@123' },
      { email: 'superadmin@example.com', password: 'Admin@123' },
    ],
  },
  {
    category: 'Vendor Login',
    credentials: [
      { email: 'vendor@pizza.com', password: 'Vendor@123' },
      { email: 'vendor@burger.com', password: 'Vendor@123' },
    ],
  },
];
