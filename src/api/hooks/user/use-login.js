import { useMutation } from '@tanstack/react-query';

import { UserService } from '@/api/services/user';

export const loginMutationKey = ['login'];

export const useLogin = () => {
  return useMutation({
    mutationKey: loginMutationKey,
    mutationFn: async (data) => {
      const response = await UserService.login(data);
      return response;
    },
  });
};
