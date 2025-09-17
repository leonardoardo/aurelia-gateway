import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from '../dto/CreateMessageDto';
import { CreateMessageUseCase } from '../../application/CreateMessageUseCase';
import { RetrieveMessagesUseCase } from '../../application/RetrieveMessageUseCase';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly retrieveMessagesUseCase: RetrieveMessagesUseCase,
  ) {}
  @Get()
  async retrieveMessages() {
    return await this.retrieveMessagesUseCase.execute();
  }

  @Post()
  async create(@Body() body: CreateMessageDto) {
    const message = await this.createMessageUseCase.execute(body);
    return {
      id: message.id,
      content: message.content,
      channel: message.channel,
    };
  }
}
