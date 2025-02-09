import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserAvatar } from '@/services/api/user.api';
import useNotification from '@/hooks/use-notification';

import { QUERY_KEYS } from '@/constants/query-keys';

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: async () => {
      const response = await getUserProfile();
      return response.data?.user;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

export const useUpdateUserAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { handleSuccess, handleError } = useNotification();

  return useMutation({
    mutationFn: async (image: File) => {
      const response = await updateUserAvatar(image);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      if (data.message) {
        handleSuccess(data.message);
      }
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
