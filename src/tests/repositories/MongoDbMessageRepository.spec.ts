import { Model } from 'mongoose';
import { Message } from '../../domain/message/Message';
import { MessageRepository } from '../../domain/message/MessageRepository';
import { MongoMessageRepository } from '../../infrastructure/repositories/MongoDbMessageRepository';
import { MessageDocument } from '../../infrastructure/schemas/message.schema';

describe('MongoMessageRepository', () => {
  let repository: MessageRepository;

  it('save() should persist by calling save on the model', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const MockModel: jest.Mock = jest.fn().mockImplementation(function (
      this: { save: any },
      doc: any,
    ) {
      Object.assign(this, doc);
      this.save = saveMock;
    });

    repository = new MongoMessageRepository(
      MockModel as unknown as Model<MessageDocument>,
    );

    const msg = new Message('1', 'u1', 'chat', 'hello');
    await repository.save(msg);

    expect(MockModel).toHaveBeenCalledWith(msg);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('findAll() should return mapped messages', async () => {
    const docs = [
      {
        id: '1',
        userId: 'u1',
        channel: 'chat',
        content: 'a',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        userId: 'u2',
        channel: 'chat',
        content: 'b',
        createdAt: new Date('2024-01-02'),
      },
    ];

    const leanMock = jest.fn().mockResolvedValue(docs);
    const findMock = jest.fn().mockReturnValue({ lean: leanMock });

    const MockModel: jest.Mock & { find?: typeof findMock } = jest.fn();
    MockModel.find = findMock;

    repository = new MongoMessageRepository(
      MockModel as unknown as Model<MessageDocument>,
    );

    const result = await repository.findAll();

    expect(findMock).toHaveBeenCalledTimes(1);
    expect(leanMock).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Message);
    expect(result[0].id).toBe('1');
    expect(result[1].content).toBe('b');
  });
});
