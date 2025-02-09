// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { getUserProfile, updateUserAvatar } from '@/services/user.service';
import { successResponse } from '@/utils/response.utils';
import { ApiResponse } from '@/types/responses/response.type';
import { GetUserProfileResponse, UpdateUserAvatarResponse } from '@/types/responses/user.responses';
import { MESSAGES } from '@/constants/messages';

export const getUserProfileController = async (
  req: Request,
  res: Response<ApiResponse<GetUserProfileResponse>>,
) => {
  const user = req.user!;

  const userProfile = await getUserProfile(user._id);

  const response = successResponse<GetUserProfileResponse>(
    MESSAGES.USER_PROFILE_FETCHED,
    {
      user: {
        ...userProfile,
        _id: userProfile._id.toString(),
        friends: userProfile.friends.map((friend) => (
          {
            ...friend,
            _id: friend._id.toString()
          }
        ))
      }
    }
  );
  res.status(200).json(response);
}

export const updateAvatarController = async (
  req: Request,
  res: Response<ApiResponse<UpdateUserAvatarResponse>>,
) => {
  const { file, user } = req;

  const avatarUrl = await updateUserAvatar(user!._id, file!.buffer, file!.originalname);

  const response = successResponse<UpdateUserAvatarResponse>(
    MESSAGES.AVATAR_UPDATED,
    { avatarUrl }
  );

  res.json(response);
};
