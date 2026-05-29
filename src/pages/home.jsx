import { PlusIcon } from 'lucide-react';
import { Navigate } from 'react-router';

import DateSelection from '@/components/date-selection';
import HeaderComponent from '@/components/header';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/auth';

import Balance from '../components/balance';

const HomePage = () => {
  const { user, isInitializing } = useAuthContext();

  if (isInitializing) return null; // Enquanto o estado de autenticação está sendo verificado, não renderiza nada.

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <HeaderComponent />
      <div className="space-y-6 p-8">
        {/* TITULO, FILTRO E BOTÃO DE NOVA TRANSAÇÃO */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="flex items-center gap-2">
            <DateSelection />
            <Button>
              <PlusIcon className="mr-2" />
              Nova transação
            </Button>
          </div>
        </div>
        {/* CARDS DE BALANCE E GRÁFICO */}
        <div className="grid-cols-[2fr, 1fr] grid">
          <Balance />
        </div>
      </div>
    </>
  );
};

export default HomePage;
