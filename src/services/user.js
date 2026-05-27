import { protectedApi, publicApi } from '@/lib/axios';

/*    
    Adaptar os dados retornados para o formato esperado no frontend
    (Ex: first_name -> firstName)
*/

//* Service Layer para lidar com as requisições relacionadas ao usuário (signup, login, me)
export const UserService = {
  /**
   * Criar novo usuário
   * @param {Object} input - Usuário a ser criado
   * @param {string} id - ID do usuário criado
   * @param {string} firstName - Primeiro nome do usuário criado
   * @param {string} lastName  - Sobrenome do usuário criado
   * @param {string} email - E-mail do usuário criado
   * @returns {Object} Usuário criado
   * @returns {string} tokens - Tokens de acesso e refresh do usuário criado
   */
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

  /**
   * Realizar login do usuário
   * @param {Object} input - Dados de login do usuário
   * @param {string} email - E-mail do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} Usuário logado
   * @returns {string} tokens - Tokens de acesso e refresh do usuário logado
   */
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

  /**
   * Obter os dados do usuário autenticado
   * @returns {Object} Usuário logado
   * @returns {string} id - ID do usuário logado
   * @returns {string} firstName - Primeiro nome do usuário logado
   * @returns {string} lastName - Sobrenome do usuário logado
   * @returns {string} email - E-mail do usuário logado
   */
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
