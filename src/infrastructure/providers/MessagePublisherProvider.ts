import { Provider } from '@nestjs/common';
import { KafkaMessagePublisher } from '../kafka/KafkaMessagePublisher';

export const MessagePublisherProvider: Provider = {
  provide: 'MessagePublisher',
  useClass: KafkaMessagePublisher,
};
