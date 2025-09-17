import { RetrieveMessagesUseCase } from './RetrieveMessageUseCase';
import { InMemoryMessageRepository } from '../infrastructure/repositories/InMemoryMessageRepository';
import { Message } from '../domain/message/Message';

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
});
