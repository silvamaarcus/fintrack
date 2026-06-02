import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

  //* CADASTRO DE USUÁRIO

  // Mutation para lidar com o processo de cadastro
  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data) => {
      const response = await UserService.signup(data);
      return response;
    },
  });

  // Função para lidar com o processo de cadastro
  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        setUser(createdUser);
        setTokens(createdUser.tokens);
        toast.success('Conta criada com sucesso!');
      },
      onError: () => {
        toast.error(
          'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
        );
      },
    });
  };

  //* LOGIN DE USUÁRIO

  // Mutation para lidar com o processo de login
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data) => {
      const response = await UserService.login(data);
      return response;
    },
  });

  // Função para lidar com o processo de login
  const login = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        setUser(loggedUser);
        setTokens(loggedUser.tokens);
        toast.success('Login realizado com sucesso.');
      },
      onError: () => {
        toast.success('Erro ao executar login. Por favor, tente novamente.');
      },
    });
  };

  //* LOGOUT DE USUÁRIO

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
