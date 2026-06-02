import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router';

import { useGetUserBalance } from '@/api/hooks';
import { formatCurrency } from '@/helpers/currency';

import BalanceItem from './balance-item';

const Balance = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const {
    data: totalBalance = {
      balance: 0,
      earnings: 0,
      expenses: 0,
      investments: 0,
    },
  } = useGetUserBalance({ from, to });
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
