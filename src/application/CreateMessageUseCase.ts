import { Injectable, Inject } from '@nestjs/common';
import { Message } from '../domain/message/Message';
import { MessageRepository } from '../domain/message/MessageRepository';
import { v4 as uuid } from 'uuid';
import { MessagePublisher } from 'src/domain/message/MessagePublisher';

interface CreateMessageInput {
  userId: string;
  channel: string;
  content: string;
}

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject('MessageRepository')
    private readonly repository: MessageRepository,

    @Inject('MessagePublisher')
    private readonly publisher: MessagePublisher,
  ) {}

  async execute(input: CreateMessageInput): Promise<Message> {
    const message = new Message(
      uuid(),
      input.userId,
      input.channel,
      input.content,
    );
    await this.repository.save(message);
    await this.publisher.publish(message);
    return message;
  }
}
