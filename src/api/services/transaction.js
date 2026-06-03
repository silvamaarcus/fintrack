import queryString from 'query-string';

import { protectedApi } from '@/lib/axios';

//* Service Layer para lidar com as requisições relacionadas as transações (criação, listagem, etc)
export const TransactionService = {
  /**
   * Criar nova transação para o usuário autenticado
   * @param {Object} input - Transação a ser criada
   * @param {string} title - Título da transação
   * @param {number} amount - Valor da transação
   * @param {Date} date - Data da transação
   * @param {string} type - Tipo da transação (EARNING, EXPENSE ou INVESTMENT)
   * @returns {Object} Dados da transação criada
   */
  create: async (input) => {
    const response = await protectedApi.post('/transactions/me', {
      name: input.name,
      amount: input.amount,
      date: input.date.toISOString(), // Converte a data para string no formato ISO antes de enviar
      type: input.type,
    });
    return {
      id: response.data.id,
      userId: response.data.user_id,
      name: response.data.name,
      amount: response.data.amount,
      date: new Date(response.data.date), // Converte a string de volta para objeto Date
      type: response.data.type,
    };
  },

  /**
   * Retorna todas as transações do usuário autenticado
   * @param {Object} input - Filtros para a listagem de transações
   * @param {Date} input.from - Data inicial para filtrar as transações
   * @param {Date} input.to - Data final para filtrar as transações
   * @returns {Array} Lista de transações do usuário dentro do período especificado
   */
  getAll: async (input) => {
    const query = queryString.stringify({
      from: input?.from,
      to: input?.to,
    });
    const response = await protectedApi.get(`/transactions/me?${query}`);
    return response.data;
  },
};
