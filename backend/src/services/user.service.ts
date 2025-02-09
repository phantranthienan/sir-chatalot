import { User } from '@/models/user.model';
import { FileNotFoundError } from '@/errors/file.errors';
import { NotFoundError } from '@/errors/api.errors';
import { uploadAvatar } from '@/utils/cloudinary.utils';
import { MESSAGES } from '@/constants/messages';

export const getAllUsers = async () => {
    const users = await User.find({ isVerified: true });
    const userObjects = users.map(user => user.toObject());

    return userObjects;
}

export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).populate<{ friends: {
        _id: string;
        email: string;
        username: string;
        avatarUrl: string;
    }[]}>('friends', '_id email username avatarUrl').exec();

    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    const userObject = user.toObject();
    return userObject;
};

export const updateUserAvatar = async (userId: string, fileBuffer: Buffer, filename: string) => {
    if (!fileBuffer) {
        throw new FileNotFoundError();
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError();
    }

    const avatarUrl = await uploadAvatar(fileBuffer, `avatars/${userId}`, filename);
    user.avatarUrl = avatarUrl;
    await user.save();

    return avatarUrl;
};
