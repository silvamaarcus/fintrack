import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useEditTransaction } from '@/api/hooks';
import { editTransactionFormSchema } from '@/forms/schemas/transaction';

const getEditTransactionDefaultValues = (transaction) => ({
  id: transaction?.id || '',
  name: transaction?.name || '',
  amount: transaction?.amount || 0,
  date: transaction ? new Date(transaction.date) : new Date(),
  type: transaction?.type || 'EARNING',
});

export const useEditTransactionForm = ({ transaction, onSuccess, onError }) => {
  const { mutateAsync: updateTransaction, isPending } = useEditTransaction();
  const form = useForm({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: getEditTransactionDefaultValues(transaction),
    shouldUnregister: true, // Garante que os campos sejam limpos ao fechar o dialog
  });

  // Sempre que a transação mudar (por exemplo, ao abrir o Sheet para uma transação diferente), reseta os campos e atualiza o campo 'id' do formulário para garantir que a edição seja feita na transação correta.
  useEffect(() => {
    form.reset(getEditTransactionDefaultValues(transaction));
    form.setValue('id', transaction?.id || '');
  }, [transaction, form]);

  const onSubmit = async (data) => {
    try {
      await updateTransaction(data);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.();
    }
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
