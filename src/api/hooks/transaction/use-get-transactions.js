import { useQuery } from '@tanstack/react-query';

import { TransactionService } from '@/api/services/transaction';
import { useAuthContext } from '@/contexts/auth';

export const getGetTransactionsQueryKey = ({ userId, from, to }) => {
  if (!from || !to) {
    return ['getTransactions', userId]; // Retorna uma chave mais genérica se as datas não estiverem disponíveis, mas ainda inclui o userId para garantir que a query seja refeita ao deslogar/logar
  }
  // Retorna datas disponiveis
  return [
    'getTransactions', // Chave base para a query de getTransactions
    userId, // Add o ID do usuário p/ garantir que a query seja refeita ao deslogar/logar
    // Add a data 'from' e 'to' p/ garantir que a query seja refeita ao alterar o filtro de data
    from,
    to,
  ];
};

export const useGetTransactions = ({ from, to }) => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: getGetTransactionsQueryKey({ userId: user.id, from, to }),
    queryFn: TransactionService.getAll({ from, to }),
  });
};
