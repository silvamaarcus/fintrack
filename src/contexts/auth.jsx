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
        const accessToken = createdUser.tokens.accessToken;
        const refreshToken = createdUser.tokens.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(createdUser);
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
        const accessToken = loggedUser.tokens.accessToken;
        const refreshToken = loggedUser.tokens.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        toast.success('Login realizado com sucesso.');
        setUser(loggedUser);
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
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
