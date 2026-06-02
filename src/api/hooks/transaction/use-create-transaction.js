import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TransactionService } from '@/api/services/transaction';
import { useAuthContext } from '@/contexts/auth';

import { getUserBalanceQueryKey } from '../user/use-get-balance';

export const useCreateTransactionKey = ['createTransaction'];

export const useCreateTransaction = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: useCreateTransactionKey,
    mutationFn: async (input) => TransactionService.create(input),
    // Invalida a query de transações para refetch automático e atualiza saldo após criação de nova transação p/ usuário logado
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user.id }),
      });
    },
  });
};
