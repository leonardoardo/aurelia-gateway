import * as KafkaModule from 'kafkajs';
import { Message } from '../../../domain/message/Message';
import { KafkaMessagePublisher } from '../../../infrastructure/kafka/KafkaMessagePublisher';

jest.mock('kafkajs', () => {
  const connect = jest.fn().mockResolvedValue(undefined);
  const disconnect = jest.fn().mockResolvedValue(undefined);
  const send = jest.fn().mockResolvedValue(undefined);
  const producer = jest.fn(() => ({ connect, disconnect, send }));
  const Kafka = jest.fn(() => ({ producer }));
  return {
    __esModule: true,
    Kafka,
    __mocks: { connect, disconnect, send, producer },
  };
});

type ProducedMessage = { key: string; value: string };
type ProducerPayload = { topic: string; messages: ProducedMessage[] };

type Mocks = {
  connect: jest.Mock<Promise<void>, []>;
  disconnect: jest.Mock<Promise<void>, []>;
  // ⬇️ mudança: antes era [unknown]; agora é [ProducerPayload]
  send: jest.Mock<Promise<void>, [ProducerPayload]>;
  producer: jest.Mock<
    {
      connect: Mocks['connect'];
      disconnect: Mocks['disconnect'];
      send: Mocks['send'];
    },
    []
  >;
};

describe('KafkaMessagePublisher', () => {
  const kafkaModule = KafkaModule as unknown as {
    __mocks: Mocks;
    Kafka: jest.Mock<
      { producer: ReturnType<Mocks['producer']> },
      [args: { clientId: string; brokers: string[] }]
    >;
  };
  const { __mocks: mocks, Kafka: KafkaMock } = kafkaModule;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates Kafka and producer in the constructor', () => {
    new KafkaMessagePublisher();

    expect(KafkaMock.mock.calls[0][0]).toEqual({
      clientId: 'aurelia-gateway',
      brokers: ['localhost:29092'],
    });
    expect(mocks.producer).toHaveBeenCalledTimes(1);
  });

  it('connects on onModuleInit', async () => {
    const publisher = new KafkaMessagePublisher();
    await publisher.onModuleInit();
    expect(mocks.connect).toHaveBeenCalledTimes(1);
  });

  it('sends a message in publish', async () => {
    const publisher = new KafkaMessagePublisher();
    await publisher.onModuleInit();

    const msg = new Message(
      '1',
      'u1',
      'chat',
      'hello',
      new Date('2025-01-01T00:00:00Z'),
    );
    await publisher.publish(msg);

    expect(mocks.send).toHaveBeenCalledTimes(1);

    // agora o calls[0][0] já é ProducerPayload tipado
    const payload = mocks.send.mock.calls[0][0];
    expect(payload.topic).toBe('raw_messages');
    expect(Array.isArray(payload.messages)).toBe(true);
    expect(payload.messages).toHaveLength(1);
    expect(payload.messages[0].key).toBe('1');

    const parsed: unknown = JSON.parse(payload.messages[0].value);
    expect(parsed as Record<string, unknown>).toMatchObject({
      id: '1',
      userId: 'u1',
      channel: 'chat',
      content: 'hello',
    });
  });

  it('disconnects on onModuleDestroy', async () => {
    const publisher = new KafkaMessagePublisher();
    await publisher.onModuleInit();
    await publisher.onModuleDestroy();
    expect(mocks.disconnect).toHaveBeenCalledTimes(1);
  });
});
