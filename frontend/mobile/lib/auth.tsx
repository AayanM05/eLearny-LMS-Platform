import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDto } from '@elearny/types';
import { getSecureItem, setSecureItem, removeSecureItem } from './storage';
import { updateApiToken } from './api';

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  setAuthSession: (user: UserDto, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedUser = await getSecureItem('elearny_user');
        const token = await getSecureItem('elearny_access_token');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          updateApiToken(token);
        }
      } catch (e) {
        await removeSecureItem('elearny_user');
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const setAuthSession = async (user: UserDto, accessToken: string, refreshToken: string) => {
    setUser(user);
    updateApiToken(accessToken);
    await setSecureItem('elearny_user', JSON.stringify(user));
    await setSecureItem('elearny_access_token', accessToken);
    await setSecureItem('elearny_refresh_token', refreshToken);
  };

  const logout = async () => {
    setUser(null);
    updateApiToken(null);
    await removeSecureItem('elearny_user');
    await removeSecureItem('elearny_access_token');
    await removeSecureItem('elearny_refresh_token');
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
