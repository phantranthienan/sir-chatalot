import axios from '@/services/api/axios.config';

import { ApiResponse } from '@/types/api/responses/response.type';
import {
  GetUserProfileResponseData,
  UpdateUserAvatarResponseData,
} from '@/types/api/responses/user.responses';

export const getUserProfile = async (): Promise<
  ApiResponse<GetUserProfileResponseData>
> => {
  const response =
    await axios.get<ApiResponse<GetUserProfileResponseData>>('/users/me');
  return response.data;
};

export const updateUserAvatar = async (
  image: File
): Promise<ApiResponse<UpdateUserAvatarResponseData>> => {
  const formData = new FormData();
  formData.append('avatar', image);
  const response = await axios.put<ApiResponse<UpdateUserAvatarResponseData>>(
    '/users/me/avatar',
    formData
  );
  return response.data;
};
