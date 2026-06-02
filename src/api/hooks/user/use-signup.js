import { useMutation } from '@tanstack/react-query';

import { UserService } from '@/api/services/user';

export const signupMutationKey = ['signup'];

export const useSignup = () => {
  return useMutation({
    mutationKey: signupMutationKey,
    mutationFn: async (data) => {
      const response = await UserService.signup(data);
      return response;
    },
  });
};
