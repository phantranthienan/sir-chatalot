import { UserData } from '@/types/common.types';
export interface GetUserProfileResponseData {
  user: UserData;
}
export interface UpdateUserAvatarResponseData {
  avatarUrl: string;
}
