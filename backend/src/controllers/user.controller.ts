// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { getUserProfile, updateUserAvatar } from '@/services/user.service';
import { successResponse } from '@/utils/response.utils';
import { ApiResponse } from '@/types/responses/response.type';
import { GetUserProfileResponseData, UpdateUserAvatarResponseData } from '@/types/responses/user.responses';
import { MESSAGES } from '@/constants/messages';

export const getUserProfileController = async (
  req: Request,
  res: Response<ApiResponse<GetUserProfileResponseData>>,
) => {
  const user = req.user!;

  const userProfile = await getUserProfile(user._id);

  const response = successResponse<GetUserProfileResponseData>(
    MESSAGES.USER_PROFILE_FETCHED,
    {
      user: {
        ...userProfile,
        _id: userProfile._id.toString(),
      }
    }
  );
  res.status(200).json(response);
}

export const updateAvatarController = async (
  req: Request,
  res: Response<ApiResponse<UpdateUserAvatarResponseData>>,
) => {
  const { file, user } = req;

  const avatarUrl = await updateUserAvatar(user!._id, file!.buffer, file!.originalname);

  const response = successResponse<UpdateUserAvatarResponseData>(
    MESSAGES.AVATAR_UPDATED,
    { avatarUrl }
  );

  res.json(response);
};
