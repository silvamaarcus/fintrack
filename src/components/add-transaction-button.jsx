import { zodResolver } from '@hookform/resolvers/zod';
import { PiggyBank, PlusIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
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
  title: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
  amount: z.number({ required_error: 'O valor é obrigatório' }),
  date: z.date({ required_error: 'A data é obrigatória' }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    errorMap: () => ({ message: 'O tipo de transação é obrigatório' }),
  }),
});

const AddTransactionButton = () => {
  const methods = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date(),
      type: 'EARNING',
    },
    shouldUnregister: true, // Garante que os campos sejam limpos ao fechar o dialog
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Dialog className="w-[400px]">
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
              {/* TÍTULO */}
              <FormField
                control={methods.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título da transação"
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
                >
                  Adicionar
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
