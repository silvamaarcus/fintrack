import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/api/services/user';
import { useAuthContext } from '@/contexts/auth';

export const getUserBalanceQueryKey = ({ userId, from, to }) => {
  if (!from || !to) {
    return ['balance', userId]; // Retorna uma chave mais genérica se as datas não estiverem disponíveis, mas ainda inclui o userId para garantir que a query seja refeita ao deslogar/logar
  }
  // Retorna datas disponiveis
  return [
    'balance', // Chave base para a query de balance
    userId, // Add o ID do usuário p/ garantir que a query seja refeita ao deslogar/logar
    // Add a data 'from' e 'to' p/ garantir que a query seja refeita ao alterar o filtro de data
    from,
    to,
  ];
};

export const useGetUserBalance = ({ from, to }) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: getUserBalanceQueryKey({ userId: user.id, from, to }),
    queryFn: () => UserService.balance({ from, to }),
    staleTime: 1000 * 60 * 5, // Refaz a query a cada 5 minutos
    enabled: !!from && !!to && !!user.id,
  });
};
