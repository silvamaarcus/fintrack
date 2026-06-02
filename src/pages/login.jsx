import { Link, Navigate } from 'react-router';

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
import { useAuthContext } from '@/contexts/auth';
import { useLoginForm } from '@/forms/hooks';

const LoginPage = () => {
  const { user, login, isInitializing } = useAuthContext();

  const methods = useLoginForm();

  const handleSubmit = (data) => login(data);

  if (isInitializing) return null;

  if (user) {
    return <Navigate to="/" replace />;
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
              <Button
                className="w-full"
                disabled={methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </CardFooter>
          </Card>
          <div className="mt-3 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Não tem uma conta?</p>
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
