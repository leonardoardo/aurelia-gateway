import { RetrieveMessagesUseCase } from '../../application/RetrieveMessageUseCase';
import { InMemoryMessageRepository } from '../../infrastructure/repositories/InMemoryMessageRepository';
import { Message } from '../../domain/message/Message';
import { MessageRepository } from '../../domain/message/MessageRepository';
import { Logger } from '@nestjs/common';

class ThrowingRepository implements MessageRepository {
  save(): Promise<void> {
    return Promise.resolve();
  }
  findAll(): Promise<Message[]> {
    return Promise.reject(new Error('boom'));
  }
}

describe('RetrieveMessagesUseCase', () => {
  let useCase: RetrieveMessagesUseCase;
  let repository: InMemoryMessageRepository;

  beforeEach(() => {
    repository = new InMemoryMessageRepository();
    useCase = new RetrieveMessagesUseCase(repository);
  });

  it('should return messages from repository', async () => {
    await repository.save(new Message('1', 'u1', 'chat', 'msg1'));
    const messages = await useCase.execute();
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('msg1');
  });

  it('should log and return empty array when repository throws', async () => {
    const errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const failingRepo = new ThrowingRepository();
    const failingUseCase = new RetrieveMessagesUseCase(failingRepo);

    const messages = await failingUseCase.execute();

    expect(messages).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      'RetrieveMessagesUseCase.execute failed',
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });
});
