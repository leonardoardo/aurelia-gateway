import { CreateMessageUseCase } from '../../application/CreateMessageUseCase';
import { InMemoryMessageRepository } from '../../infrastructure/repositories/InMemoryMessageRepository';
import { Message } from '../../domain/message/Message';

describe('CreateMessageUseCase', () => {
  let useCase: CreateMessageUseCase;
  let repository: InMemoryMessageRepository;

  beforeEach(() => {
    repository = new InMemoryMessageRepository();

    const mockPublisher = { publish: jest.fn() };

    useCase = new CreateMessageUseCase(repository, mockPublisher);
  });

  it('should create a message', async () => {
    const input = { userId: 'u1', channel: 'chat', content: 'Hello test' };

    const message: Message = await useCase.execute(input);

    expect(message).toHaveProperty('id');
    expect(message.content).toBe('Hello test');

    const allMessages = await repository.findAll();
    expect(allMessages).toHaveLength(1);
  });
});
