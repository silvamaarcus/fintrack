import {
  ExternalLinkIcon,
  Loader2Icon,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

import { useEditTransactionForm } from '@/forms/hooks/transaction/use-edit-transaction-form';

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const EditTransactionButton = ({ transaction }) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { form, onSubmit, isPending } = useEditTransactionForm({
    transaction,
    onSuccess: () => {
      setSheetIsOpen(false);
      toast.success('Transação editada com sucesso!');
    },
    onError: () => {
      toast.error(
        'Ocorreu um erro ao editar a transação. Por favor, tente novamente.',
      );
    },
  });

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ExternalLinkIcon className="text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[450px]">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <SheetTitle>Editar transação</SheetTitle>
            {/* NOME */}
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
                          field.value === 'INVESTMENT' ? 'secondary' : 'outline'
                        }
                        className="flex items-center gap-2"
                        onClick={() => field.onChange('INVESTMENT')}
                      >
                        <PiggyBank className="text-blue-500" />
                        <p className="text-sm text-muted-foreground">Invest.</p>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="sm:space-x-4">
              <SheetClose asChild>
                <Button
                  type="reset"
                  variant="secondary"
                  className="w-full"
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              </SheetClose>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2Icon className="animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  'Salvar'
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactionButton;
