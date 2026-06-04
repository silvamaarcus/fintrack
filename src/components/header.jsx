import { ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { Link } from 'react-router';

import LogoImage from '@/assets/images/logo.svg';
import { useAuthContext } from '@/contexts/auth';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const HeaderComponent = () => {
  const { user, logout } = useAuthContext();

  return (
    <header>
      <Card className="h-[72px] w-full rounded-none border-b">
        <CardContent className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-12">
            <img src={LogoImage} alt="Fintrack" className="h-8" />
            <Link
              to="/"
              className="text-sm font-bold text-primary transition-colors hover:text-primary/80"
            >
              Dashboard
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={`Perfil de ${user.firstName[0]}`}
                  />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <ChevronDownIcon className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Meu perfil</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  szie="small"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOutIcon className="mr-2" />
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </header>
  );
};

export default HeaderComponent;
