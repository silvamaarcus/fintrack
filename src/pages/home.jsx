import { Navigate } from 'react-router';

import HeaderComponent from '@/components/header';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/auth';

const HomePage = () => {
  const { user, isInitializing, logout } = useAuthContext();

  if (isInitializing) return null; // Enquanto o estado de autenticação está sendo verificado, não renderiza nada.

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <HeaderComponent />
      <h1>Olá, {user.first_name}</h1>
      <Button onClick={logout}>Sair</Button>
    </>
  );
};

export default HomePage;
