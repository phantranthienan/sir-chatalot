import { Schema, InferSchemaType, HydratedDocument, model, Types } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    socketId: {
        type: String,
        default: '',
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
});

const transformFunction = (_: any, ret: any) => {
    delete ret.__v;
    delete ret.password;
    delete ret.isVerified;
    delete ret.socketId;
    delete ret.verificationCode;
    delete ret.verificationCodeExpiresAt;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordTokenExpiresAt;
};
  
userSchema.set('toObject', { transform: transformFunction });
userSchema.set('toJSON', { transform: transformFunction });

export type UserType = InferSchemaType<typeof userSchema>;

export type UserDocument = HydratedDocument<UserType>;

export const User = model<UserDocument>('User', userSchema);