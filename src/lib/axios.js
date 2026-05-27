import axios from 'axios';

import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '@/constants/local-storage';

export const protectedApi = axios.create({
  baseURL: '/api',
});

export const publicApi = axios.create({
  baseURL: '/api',
});

// Interceptor para adicionar o token de acesso a cada requisição feita com o protectedApi
protectedApi.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  if (!accessToken) {
    return request;
  }
  request.headers['Authorization'] = `Bearer ${accessToken}`;
  return request;
});
