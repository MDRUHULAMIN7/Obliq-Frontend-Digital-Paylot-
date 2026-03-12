import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof document !== 'undefined') {
    if (token) {
      document.cookie = `accessToken=${token}; path=/; SameSite=Lax`;
    } else {
      document.cookie =
        'accessToken=; Max-Age=0; path=/; SameSite=Lax';
    }
  }
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const processQueue = (token: string | null) => {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshApi.post('/auth/refresh');
        const newToken = (refreshResponse.data as { data?: { accessToken?: string } })
          ?.data?.accessToken;

        if (!newToken) {
          throw new Error('No access token returned');
        }

        setAccessToken(newToken);
        processQueue(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(null);
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
