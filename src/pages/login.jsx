import { Link } from 'react-router';

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
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">Entre na sua conta</CardTitle>
          <CardDescription>Insira seus dados abaixo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <Input placeholder="Digite seu e-mail" />
          <PasswordInput />
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
    </div>
  );
};

export default LoginPage;
