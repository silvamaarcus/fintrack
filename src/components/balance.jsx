import { useQuery } from '@tanstack/react-query';
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router';

import { useAuthContext } from '@/contexts/auth';
import { formatCurrency } from '@/helpers/currency';
import { UserService } from '@/services/user';

import BalanceItem from './balance-item';

const Balance = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const { user } = useAuthContext();

  const {
    data: totalBalance = {
      balance: 0,
      earnings: 0,
      expenses: 0,
      investments: 0,
    },
  } = useQuery({
    queryKey: ['balance', user.id, from, to], // user.id é add p/ garatir que query seja refeita ao deslogar/logar
    queryFn: () => UserService.balance({ from, to }),
    staleTime: 1000 * 60 * 5, // Refaz a query a cada 5 minutos
    enabled: !!from && !!to,
  });

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6">
      <BalanceItem
        label="Saldo"
        amount={formatCurrency(totalBalance.balance)}
        icon={<WalletIcon size={16} />}
      />
      <BalanceItem
        label="Ganhos"
        amount={formatCurrency(totalBalance.earnings)}
        icon={<TrendingUpIcon className="text-primary-green" size={16} />}
      />
      <BalanceItem
        label="Gastos"
        amount={formatCurrency(totalBalance.expenses)}
        icon={<TrendingDownIcon className="text-primary-red" size={16} />}
      />
      <BalanceItem
        label="Investimentos"
        amount={formatCurrency(totalBalance.investments)}
        icon={<PiggyBankIcon className="text-primary-blue" size={16} />}
      />
    </div>
  );
};

export default Balance;
