import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateTransaction } from '@/api/hooks';
import { createTransactionFormSchema } from '@/forms/schemas/transaction';

export const useCreateTransactionForm = ({ onSuccess, onError }) => {
  // mutateAsync é usado para lidar com a criação da transação de forma assíncrona
  const { mutateAsync: createMutation, isPending } = useCreateTransaction();

  const form = useForm({
    resolver: zodResolver(createTransactionFormSchema),
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
      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.();
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: isPending,
  };
};
