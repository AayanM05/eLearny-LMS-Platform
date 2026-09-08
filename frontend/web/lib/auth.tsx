'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDto, Role } from '@elearny/types';

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  setAuthSession: (user: UserDto, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('elearny_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('elearny_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setAuthSession = (user: UserDto, accessToken: string, refreshToken: string) => {
    setUser(user);
    localStorage.setItem('elearny_user', JSON.stringify(user));
    localStorage.setItem('elearny_access_token', accessToken);
    localStorage.setItem('elearny_refresh_token', refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elearny_user');
    localStorage.removeItem('elearny_access_token');
    localStorage.removeItem('elearny_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setAuthSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
