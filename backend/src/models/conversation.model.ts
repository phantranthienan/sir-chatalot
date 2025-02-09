import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  name: { type: String },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export type ConversationType = InferSchemaType<typeof conversationSchema>;
export type ConversationDocument = HydratedDocument<ConversationType>;

export const Conversation = model<ConversationDocument>('Conversation', conversationSchema);
