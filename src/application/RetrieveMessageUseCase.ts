import { Injectable, Inject } from '@nestjs/common';
import { Message } from '../domain/message/Message';
import { MessageRepository } from '../domain/message/MessageRepository';
import { v4 as uuid } from 'uuid';


@Injectable()
export class RetrieveMessagesUseCase {
    constructor(
        @Inject('MessageRepository')
        private readonly repository: MessageRepository,
    ) { }

    async execute(): Promise<Message[]> {
        const messages: Message[] = [];

        try {
            (await this.repository.findAll()).map((message) => messages.push(new Message(message.id,
                message.userId,
                message.channel,
                message.content,
                message.createdAt
            )));
        } catch (error) {
            console.log(error)
        }

        return messages;
    }

}
