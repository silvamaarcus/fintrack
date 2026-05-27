import { protectedApi, publicApi } from '@/lib/axios';

/*    
    Adaptar os dados retornados para o formato esperado no frontend
    (Ex: first_name -> firstName)
*/

// Service Layer para lidar com as requisições relacionadas ao usuário (signup, login, me)
export const UserService = {
  signup: async (input) => {
    const response = await publicApi.post('/users', {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: input.password,
    });
    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      tokens: response.data.tokens,
    };
  },

  login: async (input) => {
    const response = await publicApi.post('/users/login', {
      email: input.email,
      password: input.password,
    });
    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      tokens: response.data.tokens,
    };
  },

  me: async () => {
    const response = await protectedApi.get('/users/me');
    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
    };
  },
};
