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
    }
};

export interface UpdateUserAvatarResponse {
    avatarUrl: string;
}