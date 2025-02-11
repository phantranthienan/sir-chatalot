import { UserData } from '@/types/api/common.types';
export interface GetUserProfileResponseData {
  user: UserData;
}
export interface UpdateUserAvatarResponseData {
  avatarUrl: string;
}
