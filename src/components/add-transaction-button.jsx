import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2Icon,
  PiggyBank,
  PlusIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import z from 'zod';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthContext } from '@/contexts/auth';
import { TransactionService } from '@/services/transaction';

import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const addTransactionSchema = z.object({
  name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
  amount: z.number({ required_error: 'O valor é obrigatório' }),
  date: z.date({ required_error: 'A data é obrigatória' }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    errorMap: () => ({ message: 'O tipo de transação é obrigatório' }),
  }),
});

const AddTransactionButton = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  // mutateAsync é usado para lidar com a criação da transação de forma assíncrona
  const { mutateAsync: createMutation, isPending } = useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (input) => TransactionService.create(input),
    // Invalida a query de transações para refetch automático e atualiza saldo após criação de nova transação p/ usuário logado
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', user.id] });
    },
  });

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      name: '',
      amount: 0,
      date: new Date(),
      type: 'EARNING',
    },
    shouldUnregister: true, // Garante que os campos sejam limpos ao fechar o dialog
  });

  const onSubmit = async (data) => {
    try {
      await createMutation(data);
      toast.success('Transação adicionada com sucesso!');
      setDialogIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Nova transação
          </Button>
        </DialogTrigger>
        <Form {...methods}>
          <form className="space-y-8" onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogContent>
              <DialogHeader className="!text-center">
                <DialogTitle>Adicionar Transação</DialogTitle>
                <DialogDescription>
                  Insira as informações abaixo
                </DialogDescription>
              </DialogHeader>
              {/* NOME */}
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome da transação"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* VALOR */}
              <FormField
                control={methods.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <NumericFormat
                        customInput={Input}
                        thousandSeparator="." // Define o separador de milhares como ponto
                        decimalSeparator="," // Define o separador decimal como vírgula (centavos)
                        prefix="R$ "
                        allowNegative={false} // Impede a entrada de valores negativos
                        placeholder="Digite o valor da transação"
                        {...field}
                        onChange={() => {}} // Evita que o onChange padrão do react-hook-form seja chamado
                        onValueChange={(values) =>
                          field.onChange(values.floatValue)
                        } // Impede a entrada de texto e formata o valor como número
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* DATA */}
              <FormField
                control={methods.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Digite a data da transação"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* TIPO */}
              <FormField
                control={methods.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          type="button" // Impede envio do formulário ao clicar
                          variant={
                            field.value === 'EARNING' ? 'secondary' : 'outline'
                          }
                          className="flex items-center gap-2"
                          onClick={() => field.onChange('EARNING')}
                        >
                          <TrendingUp className="text-green-500" />
                          <p className="text-sm text-muted-foreground">Ganho</p>
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === 'EXPENSE' ? 'secondary' : 'outline'
                          }
                          className="flex items-center gap-2"
                          onClick={() => field.onChange('EXPENSE')}
                        >
                          <TrendingDown className="text-red-500" />
                          <p className="text-sm text-muted-foreground">Gasto</p>
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === 'INVESTMENT'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="flex items-center gap-2"
                          onClick={() => field.onChange('INVESTMENT')}
                        >
                          <PiggyBank className="text-blue-500" />
                          <p className="text-sm text-muted-foreground">
                            Invest.
                          </p>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-2 w-full">
                <DialogClose asChild>
                  <Button type="reset" variant="secondary" className="w-full">
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => methods.handleSubmit(onSubmit)()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2Icon className="animate-spin" />
                      Adicionando...
                    </div>
                  ) : (
                    'Adicionar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>
    </>
  );
};

export default AddTransactionButton;
