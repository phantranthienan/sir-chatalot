import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const conversationSchema = new Schema({
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  unseenCount: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

const transformFunction = (_: any, ret: any) => {
  delete ret.__v;
  if (ret.unseenCount instanceof Map) {
    ret.unseenCount = Object.fromEntries(ret.unseenCount);
  };
  return ret;
};

conversationSchema.set('toObject', { transform: transformFunction });
conversationSchema.set('toJSON', { transform: transformFunction });

export type ConversationType = InferSchemaType<typeof conversationSchema>;
export type ConversationDocument = HydratedDocument<ConversationType>;

export const Conversation = model<ConversationDocument>('Conversation', conversationSchema);
