export interface GetUsersResponse {
  users: {
    _id: string;
    email: string;
    username: string;
    avatarUrl: string;
    friends: string[];
  }[];
}

export interface GetUserProfileResponse {
  user: {
    _id: string;
    email: string;
    username: string;
    avatarUrl: string;
    friends: {
      _id: string;
      email: string;
      username: string;
      avatarUrl: string;
    }[];
  };
}

export interface GetFriendRequestsResponse {
  requests: {
    sender: {
      _id: string;
      email: string;
      username: string;
    };
    recipient: string;
    createdAt: Date;
  }[];
}

export interface GetFriendsResponse {
  friends: {
    _id: string;
    email: string;
    username: string;
  }[];
}

export interface UpdateUserAvatarResponse {
  avatarUrl: string;
}
