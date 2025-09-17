import { Provider } from '@nestjs/common';
import { MongoMessageRepository } from '../repositories/MongoDbMessageRepository';

export const MessageRepositoryProvider: Provider = {
  provide: 'MessageRepository',
  useClass: MongoMessageRepository,
};