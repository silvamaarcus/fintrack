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

  /**
   * Obter o balanço financeiro do usuário autenticado para um período específico
   * @param {string} from - Data de início do período (formato: 'yyyy-MM-dd')
   * @param {string} to - Data de fim do período (formato: 'yyyy-MM-dd')
   * @returns {Object} Balanço financeiro do usuário para o período especificado
   * @returns {string} earnings - Total de ganhos no período
   * @returns {string} expenses - Total de despesas no período
   * @returns {string} investments - Total de investimentos no período
   * @returns {string} earningsPercentage - Percentual de ganhos em relação ao total
   * @returns {string} expensesPercentage - Percentual de despesas em relação ao total
   * @returns {string} investmentsPercentage - Percentual de investimentos em relação ao total
   * @returns {string} balance - Balanço   *
   * Observação: Os valores retornados são convertidos para Number para garantir que sejam tratados como números no frontend (ex: para formatação e cálculos)
   */
  balance: async ({ from, to }) => {
    if (!from || !to) return;

    const response = await protectedApi.get(
      `/users/me/balance?from=${from}&to=${to}`,
    );
    return {
      earnings: Number(response.data.earnings),
      expenses: Number(response.data.expenses),
      investments: Number(response.data.investments),
      earningsPercentage: Number(response.data.earningsPercentage),
      expensesPercentage: Number(response.data.expensesPercentage),
      investmentsPercentage: Number(response.data.investmentsPercentage),
      balance: Number(response.data.balance),
    };
  },
};
