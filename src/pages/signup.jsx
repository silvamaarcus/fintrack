import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/auth';

const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: 'O nome deve conter pelo menos 2 caracteres' }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: 'O sobrenome deve conter pelo menos 2 caracteres' }),
    email: z
      .string()
      .email({ message: 'O e-mail deve ser válido' })
      .trim()
      .min(1, { message: 'O e-mail é obrigatório' }),
    password: z
      .string()
      .trim()
      .min(6, { message: 'A senha deve conter pelo menos 6 caracteres' }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: 'A confirmação de senha é obrigatória' }),
    // Obriga a marcação da checkbox de termos de uso e políticas de privacidade
    terms: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar os termos de uso e políticas de privacidade',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica qual campo deve exibir a mensagem de erro
  }); // Garantir que a senha e a confirmação de senha sejam iguais;

const SignupPage = () => {
  const { user, signup, isInitializing } = useAuthContext();

  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const handleSubmit = (data) => signup(data);

  if (isInitializing) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className="w-[500px]">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-4xl">Crie sua conta</CardTitle>
              <CardDescription>Insira os seus dados abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 space-y-4">
              {/* Primeiro nome */}
              <FormField
                control={methods.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Segundo nome */}
              <FormField
                control={methods.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* E-mail */}
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
              {/* Senha */}
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
              {/* Confirmação de senha */}
              <FormField
                control={methods.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Digite sua senha novamente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Checkbox de termos de uso e políticas de privacidade */}
              <FormField
                control={methods.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="items-top flex space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <label
                        htmlFor="terms"
                        className={`text-xs text-muted-foreground opacity-75 ${methods.formState.errors.terms && 'text-red-500'}`}
                      >
                        Ao clicar em “Criar conta”, você aceita{' '}
                        <a
                          href="#"
                          className={`text-white underline ${methods.formState.errors.terms && 'text-red-500'}`}
                        >
                          nosso termo de uso e política de privacidade.
                        </a>
                      </label>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Criar conta</Button>
            </CardFooter>
          </Card>
          <div className="mt-3 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Já tem uma conta?</p>
            <Button variant="link" asChild>
              <Link to="/login">Faça login</Link>
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default SignupPage;
