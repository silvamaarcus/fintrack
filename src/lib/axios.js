import axios from 'axios';

import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storage';

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
  request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

protectedApi.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, apenas retorna a resposta
  async (error) => {
    const request = error.config;

    //1. Verificar se existe um refresh token
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return Promise.reject(error);
    }

    // 2. Verificar:
    // - se error é 401
    // - se a requisição ainda não foi tentada novamente (para evitar loops infinitos)
    // - se a URL da requisição não é a de refresh token (para evitar tentar dar refresh em uma requisição de refresh)
    if (
      error.response.status === 401 &&
      !request._retry &&
      !request.url.includes('/users/refresh-token')
    ) {
      request._retry = true; // Marcar a requisição como já tendo sido tentada novamente

      // 3. Se existir refresh token, tentar atualizar o access token e refazer a requisição
      try {
        const response = await protectedApi.post('/users/refresh-token', {
          refreshToken,
        });

        // 4. Se a atualização for bem-sucedida, obter os novos tokens do response
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // 5. Se o refresh token for válido, atualizar os tokens no localStorage
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);

        // 6. Atualizar o header Authorization da requisição original com o novo access token e refazer a requisição
        request.headers.Authorization = `Bearer ${newAccessToken}`;
        return protectedApi(request);
      } catch (refreshError) {
        console.error('Erro ao atualizar token:', refreshError);
        // 7. Se o refresh token for inválido ou ocorrer algum erro, limpar os tokens e redirecionar para login
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      }
    }
    return Promise.reject(error);
  },
);
