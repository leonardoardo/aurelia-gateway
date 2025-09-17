// src/infrastructure/repositories/MongoMessageRepository.ts
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageRepository } from '../../domain/message/MessageRepository';
import { Message } from '../../domain/message/Message';
import { MessageDocument } from '../schemas/message.schema';

export class MongoMessageRepository implements MessageRepository {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async save(message: Message): Promise<void> {
    const created = new this.messageModel(message);
    await created.save();
  }

  async findAll(): Promise<Message[]> {
    const docs = await this.messageModel.find().lean();
    return docs.map(
      (doc) =>
        new Message(
          doc.id,
          doc.userId,
          doc.channel,
          doc.content,
          doc.createdAt,
        ),
    );
  }
}
