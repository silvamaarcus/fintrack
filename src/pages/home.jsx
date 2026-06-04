import { Navigate } from 'react-router';

import AddTransactionButton from '@/components/add-transaction-button';
import DateSelection from '@/components/date-selection';
import HeaderComponent from '@/components/header';
import TransactionTypeChart from '@/components/transaction-type-chart';
import TransactionsTable from '@/components/transactions-table';
import { useAuthContext } from '@/contexts/auth';

import Balance from '../components/balance';

const HomePage = () => {
  const { user, isInitializing } = useAuthContext();

  if (isInitializing) return null; // Enquanto o estado de autenticação está sendo verificado, não renderiza nada.

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <HeaderComponent />
      <div className="space-y-6 p-8">
        {/* PARTE DO TOPO */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          {/* SELETOR DATA E BOTAO DE NOVA TRANSACAO */}
          <div className="flex items-center gap-2">
            <DateSelection />
            <AddTransactionButton />
          </div>
        </div>

        {/* GRAFICOS ETC */}
        <div className="grid grid-cols-[2fr,1fr] gap-6">
          <Balance />
          <TransactionTypeChart />
        </div>
        {/* TABELA DE TRANSACOES */}
        <TransactionsTable />
      </div>
    </main>
  );
};

export default HomePage;
