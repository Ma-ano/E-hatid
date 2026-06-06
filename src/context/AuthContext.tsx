// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loginUser, registerUser, logoutUser, onAuthChanged } from '../services/authService';
import { createUserDocument, getUserDocument, updateUserDocument } from '../services/userService';
import { User } from '../types';
import { UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  isRoleAuthenticated: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const isLoggingInRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser) => {
      if (isLoggingInRef.current) {
        setAuthLoading(false);
        return;
      }
      if (firebaseUser) {
        let userData = await getUserDocument(firebaseUser.uid);
        if (!userData) {
          const email = firebaseUser.email || '';
          try {
            userData = await createUserDocument(firebaseUser.uid, {
              name: firebaseUser.displayName || email.split('@')[0],
              email,
            }) as unknown as User;
          } catch {
            userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email,
              role: 'user',
            } as User;
          }
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('user');
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    isLoggingInRef.current = true;
    try {
      const credential = await loginUser(email, password);
      let userData = await getUserDocument(credential.user.uid);
      if (!userData) {
        try {
          userData = await createUserDocument(credential.user.uid, {
            name: credential.user.displayName || email.split('@')[0],
            email,
          }) as unknown as User;
        } catch {
          userData = {
            id: credential.user.uid,
            name: credential.user.displayName || email.split('@')[0],
            email,
            role: 'user',
          } as User;
        }
      }
      setUser(userData);
      setIsGuest(false);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      isLoggingInRef.current = false;
      throw e;
    }
    isLoggingInRef.current = false;
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    const { password, ...profile } = userData;
    const credential = await registerUser(profile.email!, password);
    const uid = credential.user.uid;
    try {
      const newUser = await createUserDocument(uid, profile);
      setUser(newUser as unknown as User);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch {
      const fallback: User = {
        id: uid,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        age: profile.age ? Number(profile.age) : undefined,
        address: profile.address || '',
        role: profile.role || 'user',
      };
      setUser(fallback);
      localStorage.setItem('user', JSON.stringify(fallback));
    }
    setIsGuest(false);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    try {
      await updateUserDocument(user.id, data);
    } catch {
      // silently fail
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const isRoleAuthenticated = (role: UserRole): boolean => {
    if (role === 'guest') return isGuest;
    return user?.role === role;
  };

  const isAuthenticated = !!user && !isGuest;

  return (
    <AuthContext.Provider value={{
      user, isGuest, isAuthenticated, authLoading, login, register, logout,
      continueAsGuest, updateUserProfile, isRoleAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};