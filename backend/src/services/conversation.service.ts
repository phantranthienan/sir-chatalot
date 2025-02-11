import { ApiError, BadRequestError, NotFoundError } from '@/errors/api.errors';
import { Conversation } from '../models/conversation.model';
import { User } from '../models/user.model';

export const initiateConversation = async (myId: string, otherUsername: string) => {
    const other = await User.findOne({ username: otherUsername });
    if (!other) {
        throw new NotFoundError('User not found');
    }

    const otherId = other._id.toString();

    if (myId === otherId) {
        throw new BadRequestError('You cannot initiate a conversation with yourself');
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [myId, otherId], $size: 2 },
    });

    if (conversation) {
        throw new ApiError(409, 'Conversation already exists');
    }

    conversation = new Conversation({
        participants: [myId, otherId],
    });

    await conversation.save();

    const conversationObject = conversation.toObject();

    return conversationObject;
};

export const getConversations = async (userId: string) => {
    const conversations = await Conversation.find({ participants: userId })
        .populate('participants')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
    
    const conversationObjects = conversations.map(conversation => conversation.toObject());
    return conversationObjects;
};

export const getConversationById = async (conversationId: string) => {
    const conversation = await Conversation.findById(conversationId)
        .populate('participants')
        .populate('lastMessage');

    if (!conversation) {
        throw new NotFoundError('Conversation not found');
    }

    const conversationObject = conversation.toObject();
    return conversationObject;
};