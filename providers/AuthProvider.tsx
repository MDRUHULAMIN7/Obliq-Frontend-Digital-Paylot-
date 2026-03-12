'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api, getAccessToken, setAccessToken } from '../lib/api';
import type { ApiResponse, LoginCredentials, User } from '../types';

type TokenPayload = {
  userId?: string;
  user?: User;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`),
  );
  return match ? match[2] : null;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      '/auth/login',
      credentials,
    );

    const access = response.data?.data?.accessToken ?? null;
    const loggedUser = response.data?.data?.user ?? null;

    setAccessToken(access);
    setToken(access);
    setUser(loggedUser);
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const hydrateFromToken = useCallback(async () => {
    const cookieToken = getCookie('accessToken');
    if (!cookieToken) {
      return;
    }

    setAccessToken(cookieToken);
    setToken(cookieToken);

    try {
      const payload = jwtDecode<TokenPayload>(cookieToken);
      if (payload.user) {
        setUser(payload.user);
        return;
      }

      if (payload.userId) {
        const response = await api.get<ApiResponse<User>>(
          `/users/${payload.userId}`,
        );
        setUser(response.data?.data ?? null);
      }
    } catch {
      setAccessToken(null);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void hydrateFromToken();
  }, [hydrateFromToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken: token,
      login,
      logout,
      getAccessToken,
    }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
