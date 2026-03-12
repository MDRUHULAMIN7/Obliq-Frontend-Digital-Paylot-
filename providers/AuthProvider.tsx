'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';
import type { ApiResponse, LoginCredentials, User } from '../types';

type AuthContextValue = {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      '/auth/login',
      credentials,
    );

    const loggedUser = response.data?.data?.user ?? null;

    setUser(loggedUser);
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
  }, []);

  const hydrateFromToken = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      setUser(response.data?.data ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void hydrateFromToken();
  }, [hydrateFromToken]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
