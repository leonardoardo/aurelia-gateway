import { Message } from './Message';

export abstract class MessagePublisher {
  abstract publish(message: Message): Promise<void>;
}
