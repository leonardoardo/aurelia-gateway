import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { MessagePublisher } from '../../domain/message/MessagePublisher';
import { Message } from '../../domain/message/Message';

@Injectable()
export class KafkaMessagePublisher implements MessagePublisher, OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'aurelia-gateway',
      brokers: ['localhost:29092'],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publish(message: Message): Promise<void> {
    await this.producer.send({
      topic: 'raw_messages',
      messages: [
        {
          key: message.id,
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
