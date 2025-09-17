import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import type { Server } from 'http';
import { InMemoryMessageRepository } from '../infrastructure/repositories/InMemoryMessageRepository';
import { MessageModule } from '../message/message.module';

const mockPublisher = { publish: jest.fn() };
const mockMessageModel = {};

type MessageResponse = { id: string; content: string; channel: string };

function isMessageResponse(x: unknown): x is MessageResponse {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Record<string, unknown>).id === 'string' &&
    typeof (x as Record<string, unknown>).content === 'string' &&
    typeof (x as Record<string, unknown>).channel === 'string'
  );
}

function isMessageArray(x: unknown): x is MessageResponse[] {
  return Array.isArray(x) && x.every(isMessageResponse);
}

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

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
    server = app.getHttpServer() as unknown as Server;
  });

  it('/messages (POST)', async () => {
    const response: Response = await request(server)
      .post('/messages')
      .send({ userId: 'u1', channel: 'chat', content: 'Hello E2E' })
      .expect(201);

    const body: unknown = response.body;
    expect(isMessageResponse(body)).toBe(true);
    const msg = body as MessageResponse;

    expect(msg).toHaveProperty('id');
    expect(msg.content).toBe('Hello E2E');
  });

  it('/messages (GET)', async () => {
    await request(server)
      .post('/messages')
      .send({ userId: 'u2', channel: 'chat', content: 'Second message' })
      .expect(201);

    const response: Response = await request(server)
      .get('/messages')
      .expect(200);

    const body: unknown = response.body;
    expect(isMessageArray(body)).toBe(true);
    const arr = body as MessageResponse[];

    expect(arr.length).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
