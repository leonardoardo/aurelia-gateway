import { Provider } from '@nestjs/common';
import { KafkaMessagePublisher } from '../kafka/KafkaMessagePublisher';
import { MessagePublisher } from '../../domain/message/MessagePublisher';

export const MessagePublisherProvider: Provider = {
  provide: 'MessagePublisher',
  useClass: KafkaMessagePublisher,
};
