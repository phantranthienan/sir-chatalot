import { Message } from "@/models/message.model";
import { Conversation } from "@/models/conversation.model";
import { NotFoundError } from "@/errors/api.errors";
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    text: string,
) => {
    const message = new Message({
        conversation: conversationId,
        sender: senderId,
        text,
    });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const receiverId = conversation.participants.find((p) => p.toString() !== senderId);
    if (!receiverId) {
      throw new NotFoundError('Receiver not found in conversation');
    }

    await Promise.all([
        message.save(), 
        Conversation.findByIdAndUpdate(conversationId, { 
            lastMessage: message._id,
            $inc: { [`unseenCount.${receiverId}`]: 1 },
        })
    ]);

    const populatedMessage = await message.populate('sender');
    const messageObject = populatedMessage.toObject();

    return messageObject;
}

export const getMessages = async (
    conversationId: string, 
    // limit: number, 
    // skip: number
) => {
    const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: 1 })
        // .skip(skip)
        // .limit(limit)
        .populate('sender');
    
    const messageObjects = messages.map(message => message.toObject());
    return messageObjects;
}
