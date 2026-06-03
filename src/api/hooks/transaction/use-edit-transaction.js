import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TransactionService } from '@/api/services/transaction';
import { useAuthContext } from '@/contexts/auth';

import { getUserBalanceQueryKey } from '../user/use-get-balance';
import { getGetTransactionsQueryKey } from './use-get-transactions';

export const useEditTransactionKey = ['editTransaction'];

export const useEditTransaction = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: useEditTransactionKey,
    mutationFn: async (input) => TransactionService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user.id }),
      }); // Invalida a query de transações para refetch automático e atualiza saldo após criação de nova transação p/ usuário logado
      queryClient.invalidateQueries({
        queryKey: getGetTransactionsQueryKey({ userId: user.id }),
      }); // Invalida a query de transações para refetch automático e atualiza saldo após criação de nova transação p/ usuário logado
    },
  });
};
