// Type definitions for responses related to authentication
import { UserData } from '@/types/common.types';
export interface RegisterResponseData {
  user: UserData;
}

export interface LoginResponseData {
  accessToken: string;
  user: UserData;
}

export interface CheckAuthResponseData {
  user: UserData;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}
