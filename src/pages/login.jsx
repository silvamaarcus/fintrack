import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'O e-mail deve ser válido' })
    .trim()
    .min(1, { message: 'O e-mail é obrigatório' }),
  password: z.string().trim().min(6, {
    message: 'A senha é obrigatória.',
  }),
});

const LoginPage = () => {
  const [user, setUser] = useState(null);

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

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

  const handleSubmit = (data) => {
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

  if (user) {
    return <h1 className="text-2xl">Bem-vindo, {user.first_name}!</h1>;
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className="w-[500px]">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl">Entre na sua conta</CardTitle>
              <CardDescription>Insira seus dados abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Fazer login</Button>
            </CardFooter>
          </Card>
          <div className="mt-3 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Já tem uma conta?</p>
            <Button variant="link" asChild>
              <Link to="/signup">Criar agora</Link>
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default LoginPage;
