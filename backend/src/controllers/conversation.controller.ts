import { Request, Response } from 'express';

import { initiateConversation, getConversations, getConversationById } from '@/services/conversation.service';
import { sendMessage, getMessages } from '@/services/message.service';

import { successResponse } from '@/utils/response.utils';
import { ApiResponse } from '@/types/responses/response.type';

export const initiateConversationController = async (
    req: Request,
    res: Response<ApiResponse<null>>,
) => {
    const user = req.user!;
    const { username: otherUsername } = req.body;

    const myId = user._id.toString();

    await initiateConversation(myId, otherUsername);
    res.status(201).json(successResponse("Initiate conversation successfully", null));
}

export const getConversationsController = async (
    req: Request,
    res: Response<ApiResponse<any>>,
) => {
    const user = req.user!;
    const userId = user._id.toString();

    const conversations = await getConversations(userId);
    res.status(200).json(successResponse("Get conversations successfully", {
        conversations,
    }));
}

export const getConversationDetailsController = async (
    req: Request,
    res: Response<ApiResponse<any>>,
) => {
    const { conversationId } = req.params;

    const conversation = await getConversationById(conversationId);
    res.status(200).json(successResponse("Get conversation details successfully", {
        conversation,
    }));
}

export const sendMessageController = async (
    req: Request,
    res: Response<ApiResponse<any>>,
) => {
    const user = req.user!;
    const { text } = req.body;
    const { conversationId } = req.params;

    const senderId = user._id.toString();

    const message = await sendMessage(conversationId, senderId, text);
    res.status(201).json(successResponse("Send message successfully", message));
}

export const getMessagesController = async (
    req: Request,
    res: Response<ApiResponse<any>>,
) => {
    const { conversationId } = req.params;

    const messages = await getMessages(conversationId);
    res.status(200).json(successResponse("Get messages successfully", {
        messages,
    }));
}