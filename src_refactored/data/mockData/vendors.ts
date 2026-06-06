// Vendor interface
export interface Vendor {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  password: string;
  storeAddress?: string;
  storeCategory?: string;
  token?: string;
  rememberMe?: boolean;
}

// Mock Vendors
export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    fullName: 'John Smith',
    businessName: 'Pizza Palace',
    email: 'vendor@pizza.com',
    phone: '+1234567890',
    password: 'Vendor@123',
    storeAddress: '123 Main Street, Downtown',
    storeCategory: 'Italian',
    token: 'vendor-mock-token-1',
  },
  {
    id: 'vendor-2',
    fullName: 'Sarah Johnson',
    businessName: 'Burger Station',
    email: 'vendor@burger.com',
    phone: '+0987654321',
    password: 'Vendor@123',
    storeAddress: '456 Main Street, Downtown',
    storeCategory: 'Fast Food',
    token: 'vendor-mock-token-2',
  },
];

// Reference for legacy compatibility
export const MOCK_VENDORS_REF = [
  {
    id: 'vendor-1',
    fullName: 'John Smith',
    businessName: 'Pizza Palace',
    email: 'vendor@pizza.com',
    phone: '+1234567890',
    password: 'Vendor@123',
    storeAddress: '123 Main Street, Downtown',
    storeCategory: 'Italian',
    token: 'vendor-mock-token-1',
  },
  {
    id: 'vendor-2',
    fullName: 'Sarah Johnson',
    businessName: 'Burger Station',
    email: 'vendor@burger.com',
    phone: '+0987654321',
    password: 'Vendor@123',
    storeAddress: '456 Main Street, Downtown',
    storeCategory: 'Fast Food',
    token: 'vendor-mock-token-2',
  },
];
