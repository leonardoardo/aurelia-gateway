import { Inject, Injectable, Logger } from '@nestjs/common';
import { Message } from '../domain/message/Message';
import { MessageRepository } from '../domain/message/MessageRepository';

@Injectable()
export class RetrieveMessagesUseCase {
  private readonly logger = new Logger(RetrieveMessagesUseCase.name);
  constructor(
    @Inject('MessageRepository')
    private readonly repository: MessageRepository,
  ) {}

  async execute(): Promise<Message[]> {
    try {
      const items = await this.repository.findAll();
      return items.map(
        (message) =>
          new Message(
            message.id,
            message.userId,
            message.channel,
            message.content,
            message.createdAt,
          ),
      );
    } catch (error) {
      this.logger.error(
        'RetrieveMessagesUseCase.execute failed',
        error as Error,
      );
      return [];
    }
  }
}
