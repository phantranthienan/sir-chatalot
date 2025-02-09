// src/models/message.model.ts
import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const messageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

export type MessageType = InferSchemaType<typeof messageSchema>;
export type MessageDocument = HydratedDocument<MessageType>;

export const Message = model<MessageDocument>('Message', messageSchema);
