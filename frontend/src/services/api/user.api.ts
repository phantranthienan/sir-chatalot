import axios from '@/services/api/axios.config';

import { ApiResponse } from '@/types/api/responses/response.types';
import {
  GetUserProfileResponse,
  UpdateUserAvatarResponse,
} from '@/types/api/responses/user.responses';

export const getUserProfile = async (): Promise<
  ApiResponse<GetUserProfileResponse>
> => {
  const response =
    await axios.get<ApiResponse<GetUserProfileResponse>>('/users/me');
  return response.data;
};

export const updateUserAvatar = async (
  image: File
): Promise<ApiResponse<UpdateUserAvatarResponse>> => {
  const formData = new FormData();
  formData.append('avatar', image);
  const response = await axios.put<ApiResponse<UpdateUserAvatarResponse>>(
    '/users/me/avatar',
    formData
  );
  return response.data;
};
