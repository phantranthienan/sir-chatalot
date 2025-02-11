import { Message } from "@/models/message.model";
import { Conversation } from "@/models/conversation.model";
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    text: string,
) => {
    console.log('sendMessage', conversationId, senderId, text);
    const message = new Message({
        conversation: conversationId,
        sender: senderId,
        text,
    });

    await Promise.all([
        message.save(), 
        Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id })
    ]);

    const populatedMessage = await message.populate('sender');
    const messageObject = populatedMessage.toObject();

    return messageObject;
}

export const getMessages = async (conversationId: string) => {
    const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: 1 })
        .populate('sender');
    const messageObjects = messages.map(message => message.toObject());
    return messageObjects;
}