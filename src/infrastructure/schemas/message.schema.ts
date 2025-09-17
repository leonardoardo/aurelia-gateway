import { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document {
  id: string;
  userId: string;
  channel: string;
  content: string;
  createdAt: Date;
}

export const MessageSchema = new Schema<MessageDocument>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  channel: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
