import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useLogin, useSignup } from '@/api/hooks';
import { UserService } from '@/api/services/user';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storage';

export const AuthContext = createContext({
  user: null,
  isInitializing: true,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext); // Custom hook para facilitar o acesso ao contexto de autenticação

const setTokens = (tokens) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
};

export const AuthContextProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Mutation para lidar com o processo de cadastro
  const signupMutation = useSignup();
  // Mutation para lidar com o processo de login
  const loginMutation = useLogin();

  // Função para lidar com o processo de cadastro
  const signup = async (data) => {
    try {
      const createdUser = await signupMutation.mutateAsync(data);
      setUser(createdUser);
      setTokens(createdUser.tokens);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      console.log('Erro ao executar cadastro:', error);
    }
  };

  // Função para lidar com o processo de login
  const login = async (data) => {
    try {
      const loggedUser = await loginMutation.mutateAsync(data);
      setUser(loggedUser);
      setTokens(loggedUser.tokens);
      toast.success('Login realizado com sucesso.');
    } catch (error) {
      toast.error('Erro ao executar login. Por favor, tente novamente.');
      console.error('Erro ao executar login:', error);
    }
  };

  // Função para lidar com o processo de logout
  const logout = () => {
    setUser(null);
    removeTokens();
    toast.success('Logout realizado com sucesso.');
  };

  // Persistir o estado de autenticação ao recarregar a página pelo localStorage
  useEffect(() => {
    const init = async () => {
      try {
        setIsInitializing(true); // Indica que a inicialização está em andamento (impede usuário de acessar a aplicação antes de verificar o estado de autenticação)
        const accessToken = localStorage.getItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY,
        );
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY,
        );

        if (!accessToken || !refreshToken) {
          return;
        }

        const response = await UserService.me(); // Tenta obter os dados do usuário logado usando o access token
        setUser(response);
      } catch (error) {
        setUser(null);
        console.error('Erro ao acessar os tokens no localStorage:', error);
      } finally {
        setIsInitializing(false); // Indica que a inicialização foi concluída
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isInitializing: isInitializing,
        login: login,
        signup: signup,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
