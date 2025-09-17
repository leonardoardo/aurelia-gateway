import { MetricsService } from '../../../infrastructure/observability/metrics.service';
import * as PromClient from 'prom-client';

jest.mock('prom-client', () => {
  const Registry = jest.fn();
  const collectDefaultMetrics = jest.fn();
  const Histogram = jest.fn();
  const Gauge = jest.fn();

  return {
    __esModule: true,
    Registry,
    collectDefaultMetrics,
    Histogram,
    Gauge,
  };
});

type MockRegistry = { metrics: jest.Mock<Promise<string>, []> };

type PromClientMock = {
  Registry: jest.Mock<MockRegistry, []>;
  collectDefaultMetrics: jest.Mock<void, [arg: { register: unknown }]>;
  Histogram: jest.Mock<void, [Record<string, unknown>]>;
  Gauge: jest.Mock<void, [Record<string, unknown>]>;
};

describe('MetricsService', () => {
  const prom = PromClient as unknown as PromClientMock;
  let registry: MockRegistry;

  beforeEach(() => {
    jest.clearAllMocks();

    prom.Registry.mockImplementation(() => {
      const metricsMock: jest.Mock<Promise<string>, []> = jest
        .fn<Promise<string>, []>()
        .mockResolvedValue('mock-metrics');
      registry = { metrics: metricsMock };
      return registry;
    });

    // No unused params
    prom.Histogram.mockImplementation(() => undefined);
    prom.Gauge.mockImplementation(() => undefined);
  });

  it('initializes registry, collects default metrics, and registers Histogram/Gauge with the same registry', () => {
    const service = new MetricsService();

    expect(prom.Registry).toHaveBeenCalledTimes(1);

    expect(prom.collectDefaultMetrics).toHaveBeenCalledTimes(1);
    expect(prom.collectDefaultMetrics).toHaveBeenCalledWith({
      register: registry,
    });

    expect(prom.Histogram).toHaveBeenCalledTimes(1);
    expect(prom.Histogram).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route', 'status_code'],
        buckets: [0.1, 0.5, 1, 2, 5],
        registers: [registry],
      }),
    );

    expect(prom.Gauge).toHaveBeenCalledTimes(1);
    expect(prom.Gauge).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'kafka_consumer_lag',
        help: 'Kafka consumer lag by topic/partition',
        labelNames: ['topic', 'partition'],
        registers: [registry],
      }),
    );

    expect(service).toBeDefined();
  });

  it('getMetrics returns the value from registry.metrics()', async () => {
    const service = new MetricsService();

    const result = await service.getMetrics();

    expect(registry.metrics).toHaveBeenCalledTimes(1);
    expect(result).toBe('mock-metrics');
  });
});
