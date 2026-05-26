import { useMutation } from '@tanstack/react-query';
import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { toast } from 'sonner';

import api from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
});

export const useAuthContext = () => useContext(AuthContext); // Custom hook para facilitar o acesso ao contexto de autenticação

const LOCAL_STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';
const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';

const setTokens = (tokens) => {
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //* CADASTRO DE USUÁRIO

  // Mutation para lidar com o processo de cadastro
  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data) => {
      const response = await api.post('/users', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      });
      return response.data;
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
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password,
      });
      return response.data;
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

  // Persistir o estado de autenticação ao recarregar a página pelo localStorage
  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY,
        );
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY,
        );

        if (!accessToken || !refreshToken) {
          return;
        }

        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        removeTokens();
        console.error('Erro ao acessar os tokens no localStorage:', error);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, login: login, signup: signup }}>
      {children}
    </AuthContext.Provider>
  );
};
