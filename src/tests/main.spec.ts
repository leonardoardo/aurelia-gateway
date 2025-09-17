import 'reflect-metadata';
import { createRequire } from 'node:module';

jest.mock('../infrastructure/observability/tracing', () => ({
  __esModule: true,
  otelSDK: { start: jest.fn() },
}));

jest.mock('@nestjs/common', () => ({
  __esModule: true,
  ValidationPipe: class {},
}));

jest.mock('../infrastructure/observability/metrics.interceptor', () => ({
  __esModule: true,
  MetricsInterceptor: class {},
}));

jest.mock('@nestjs/core', () => ({
  __esModule: true,
  NestFactory: { create: jest.fn() },
}));

jest.mock('../app.module', () => ({
  __esModule: true,
  AppModule: class {},
}));

type OtelSDKMock = { start: jest.Mock };
type TracingModuleMock = { otelSDK: OtelSDKMock };
type NestAppMock = {
  useGlobalPipes: jest.Mock;
  useGlobalInterceptors: jest.Mock;
  get: jest.Mock;
  listen: jest.Mock;
};
type NestFactoryModuleMock = {
  NestFactory: { create: jest.Mock<Promise<NestAppMock>, [unknown?]> };
};

const req = createRequire(__filename);

function loadTracing(): TracingModuleMock {
  return req('../infrastructure/observability/tracing') as TracingModuleMock;
}

function loadNestFactory(): NestFactoryModuleMock {
  return req('@nestjs/core') as NestFactoryModuleMock;
}

describe('main bootstrap', () => {
  const originalPort = process.env.PORT;

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.PORT = originalPort;
    process.exitCode = 0;
  });

  it('starts otel, bootstraps Nest app and listens on env PORT', async () => {
    const tracing = loadTracing();
    const { NestFactory } = loadNestFactory();

    const listen = jest.fn().mockResolvedValue(undefined);
    const useGlobalPipes = jest.fn();
    const useGlobalInterceptors = jest.fn();
    const get = jest.fn().mockReturnValue({});

    NestFactory.create.mockResolvedValue({
      useGlobalPipes,
      useGlobalInterceptors,
      get,
      listen,
    });

    process.env.PORT = '4567';
    req('../main');

    await new Promise<void>((r) => setImmediate(r));

    expect(tracing.otelSDK.start.mock.calls.length).toBe(1);
    expect(NestFactory.create.mock.calls.length).toBe(1);
    expect(useGlobalPipes.mock.calls.length).toBe(1);
    expect(useGlobalInterceptors.mock.calls.length).toBe(1);
    expect(get.mock.calls.length).toBe(1);
    expect(listen).toHaveBeenCalledWith('4567');
  });

  it('falls back to default port when PORT is undefined', async () => {
    const tracing = loadTracing();
    const { NestFactory } = loadNestFactory();

    const listen = jest.fn().mockResolvedValue(undefined);
    const useGlobalPipes = jest.fn();
    const useGlobalInterceptors = jest.fn();
    const get = jest.fn().mockReturnValue({});

    NestFactory.create.mockResolvedValue({
      useGlobalPipes,
      useGlobalInterceptors,
      get,
      listen,
    });

    delete process.env.PORT;
    req('../main');

    await new Promise<void>((r) => setImmediate(r));

    expect(tracing.otelSDK.start.mock.calls.length).toBe(1);
    expect(NestFactory.create.mock.calls.length).toBe(1);
    expect(useGlobalPipes.mock.calls.length).toBe(1);
    expect(useGlobalInterceptors.mock.calls.length).toBe(1);
    expect(get.mock.calls.length).toBe(1);
    expect(listen).toHaveBeenCalledWith(3000);
  });

  it('sets process.exitCode=1 on bootstrap failure', async () => {
    const tracing = loadTracing();
    const { NestFactory } = loadNestFactory();

    NestFactory.create.mockRejectedValue(new Error('boom'));

    req('../main');

    await new Promise<void>((r) => setImmediate(r));

    expect(tracing.otelSDK.start.mock.calls.length).toBe(1);
    expect(NestFactory.create.mock.calls.length).toBe(1);
    expect(process.exitCode).toBe(1);
  });
});
