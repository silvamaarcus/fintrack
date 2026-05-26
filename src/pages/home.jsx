import { Navigate } from 'react-router';

import { useAuthContext } from '@/contexts/auth';

const HomePage = () => {
  const { user, isInitializing } = useAuthContext();

  if (isInitializing) return null; // Enquanto o estado de autenticação está sendo verificado, não renderiza nada.

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <h1>Home Page</h1>;
};

export default HomePage;
