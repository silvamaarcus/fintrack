import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useEditTransaction } from '@/api/hooks';
import { editTransactionFormSchema } from '@/forms/schemas/transaction';

export const useEditTransactionForm = ({ transaction, onSuccess, onError }) => {
  const { mutateAsync: updateTransaction } = useEditTransaction();
  const form = useForm({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: {
      id: transaction?.id || '',
      name: transaction?.name || '',
      amount: transaction?.amount || 0,
      date: transaction ? new Date(transaction.date) : new Date(),
      type: transaction?.type || 'EARNING',
    },
    shouldUnregister: true, // Garante que os campos sejam limpos ao fechar o dialog
  });

  const onSubmit = async (data) => {
    await updateTransaction({ data });
    try {
      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.();
    }
  };

  return {
    form,
    onSubmit,
  };
};
