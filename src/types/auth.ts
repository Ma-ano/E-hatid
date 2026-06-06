// src/types/auth.ts
export type UserRole = 'guest' | 'user' | 'rider' | 'admin' | 'vendor';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}
