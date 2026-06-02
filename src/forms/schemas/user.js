import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'O e-mail deve ser válido' })
    .trim()
    .min(1, { message: 'O e-mail é obrigatório' }),
  password: z.string().trim().min(6, {
    message: 'A senha é obrigatória.',
  }),
});

export const signupFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: 'O nome deve conter pelo menos 2 caracteres' }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: 'O sobrenome deve conter pelo menos 2 caracteres' }),
    email: z
      .string()
      .email({ message: 'O e-mail deve ser válido' })
      .trim()
      .min(1, { message: 'O e-mail é obrigatório' }),
    password: z
      .string()
      .trim()
      .min(6, { message: 'A senha deve conter pelo menos 6 caracteres' }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: 'A confirmação de senha é obrigatória' }),
    // Obriga a marcação da checkbox de termos de uso e políticas de privacidade
    terms: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar os termos de uso e políticas de privacidade',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica qual campo deve exibir a mensagem de erro
  }); // Garantir que a senha e a confirmação de senha sejam iguais;
