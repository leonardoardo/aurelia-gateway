import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from '../interface/controllers/MessageController';
import { CreateMessageUseCase } from '../application/CreateMessageUseCase';
import { MessageRepositoryProvider } from '../infrastructure/providers/MessageRepositoryProvider';
import { MessageSchema } from '../infrastructure/schemas/message.schema';
import { RetrieveMessagesUseCase } from 'src/application/RetrieveMessageUseCase';
import { MessagePublisherProvider } from 'src/infrastructure/providers/MessagePublisherProvider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [
    MessageRepositoryProvider,
    CreateMessageUseCase,
    RetrieveMessagesUseCase,
    MessagePublisherProvider,
  ],
  exports: [CreateMessageUseCase],
})
export class MessageModule {}
