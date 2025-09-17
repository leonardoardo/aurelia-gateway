import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

jest.mock('@nestjs/mongoose', () => {
  class MockMongooseDynamicModule {}
  const forRoot = jest.fn().mockImplementation(() => ({
    module: MockMongooseDynamicModule,
  }));
  return { __esModule: true, MongooseModule: { forRoot } };
});

jest.mock('../message/message.module', () => {
  class MockMessageModule {}
  Module({})(MockMessageModule);
  return { __esModule: true, MessageModule: MockMessageModule };
});

jest.mock('../infrastructure/observability/metrics.module', () => {
  class MockMetricsModule {}
  Module({})(MockMetricsModule);
  return { __esModule: true, MetricsModule: MockMetricsModule };
});

import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../app.module';

type MongooseModuleMock = { forRoot: jest.Mock };

describe('AppModule', () => {
  it('should compile and configure MongooseModule with the expected URI', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    expect(moduleRef).toBeDefined();
    const mocked = MongooseModule as unknown as MongooseModuleMock;
    expect(mocked.forRoot.mock.calls.length).toBe(1);
    expect(mocked.forRoot).toHaveBeenCalledWith(
      'mongodb://localhost:27017/aurelia',
    );
  });
});
