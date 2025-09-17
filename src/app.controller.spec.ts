import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InMemoryMessageRepository } from '../src/infrastructure/repositories/InMemoryMessageRepository';
import { MessageModule } from '../src/message/message.module';

// mock para publisher (Kafka)
const mockPublisher = { publish: jest.fn() };

// mock para mongoose model
const mockMessageModel = {};

describe('MessageController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessageModule],
    })
      .overrideProvider('MessageRepository')
      .useClass(InMemoryMessageRepository)
      .overrideProvider('MessagePublisher')
      .useValue(mockPublisher)
      .overrideProvider('MessageModel')
      .useValue(mockMessageModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/messages (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/messages')
      .send({ userId: 'u1', channel: 'chat', content: 'Hello E2E' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('Hello E2E');
  });

  it('/messages (GET)', async () => {
    await request(app.getHttpServer())
      .post('/messages')
      .send({ userId: 'u2', channel: 'chat', content: 'Second message' })
      .expect(201);

    const response = await request(app.getHttpServer()).get('/messages').expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
