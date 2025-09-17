import { Message } from '../../domain/message/Message';
import { MessageRepository } from '../../domain/message/MessageRepository';

export class InMemoryMessageRepository implements MessageRepository {
  private messages: Message[] = [];

  async save(message: Message): Promise<void> {
    this.messages.push(message);
    console.log('[Repository] Saved:', message);
    return Promise.resolve();
  }

  async findAll(): Promise<Message[]> {
    return Promise.resolve(this.messages);
  }
}
