import { z } from 'zod';

export const createTransactionFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
  amount: z.number({ required_error: 'O valor é obrigatório' }),
  date: z.date({ required_error: 'A data é obrigatória' }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    errorMap: () => ({ message: 'O tipo de transação é obrigatório' }),
  }),
});

// Usa o schema de criação como base e adiciona o campo 'id' para edição.
export const editTransactionFormSchema = createTransactionFormSchema.extend({
  id: z.string.uuid()({ required_error: 'O ID da transação é obrigatório' }),
});
