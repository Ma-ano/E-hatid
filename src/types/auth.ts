// src/types/auth.ts
export type UserRole = 'guest' | 'user' | 'customer' | 'rider' | 'admin' | 'vendor';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  activeRole: UserRole | null;
  roles: UserRole[];
}
