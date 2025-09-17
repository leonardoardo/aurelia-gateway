import { createRequire } from 'node:module';

jest.mock('@opentelemetry/sdk-node', () => {
  const NodeSDK = jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    shutdown: jest.fn().mockResolvedValue(undefined),
  }));
  return { __esModule: true, NodeSDK };
});

jest.mock('@opentelemetry/auto-instrumentations-node', () => {
  const getNodeAutoInstrumentations = jest.fn().mockReturnValue(['auto-inst']);
  return { __esModule: true, getNodeAutoInstrumentations };
});

jest.mock('@opentelemetry/exporter-trace-otlp-http', () => {
  const OTLPTraceExporter = jest.fn().mockImplementation(() => ({}));
  return { __esModule: true, OTLPTraceExporter };
});

jest.mock('@opentelemetry/sdk-trace-base', () => {
  const ConsoleSpanExporter = jest.fn().mockImplementation(() => ({}));
  const SimpleSpanProcessor = jest.fn().mockImplementation(() => ({}));
  return {
    __esModule: true,
    ConsoleSpanExporter,
    SimpleSpanProcessor,
  };
});

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

type NodeSDKInstance = {
  start: () => Promise<void>;
  shutdown: () => Promise<void>;
};
type NodeSDKMockFn = jest.Mock<
  NodeSDKInstance,
  [args: Record<string, unknown>]
>;
const NodeSDKMock = NodeSDK as unknown as NodeSDKMockFn;

const OTLPExporterMock = OTLPTraceExporter as unknown as jest.Mock<
  unknown,
  [opts: { url: string }]
>;
const ConsoleExporterMock = ConsoleSpanExporter as unknown as jest.Mock<
  unknown,
  []
>;
const SimpleProcessorMock = SimpleSpanProcessor as unknown as jest.Mock<
  unknown,
  [exporter: unknown]
>;
const AutoInstrMock = getNodeAutoInstrumentations as unknown as jest.Mock<
  unknown[],
  []
>;

let tracingModule: typeof import('../../../infrastructure/observability/tracing');

const req = createRequire(__filename);

beforeAll(() => {
  const required: unknown = req(
    '../../../infrastructure/observability/tracing',
  );
  tracingModule =
    required as typeof import('../../../infrastructure/observability/tracing');
});

describe('tracing (otelSDK)', () => {
  it('builds exporters, processors, and NodeSDK with expected options', () => {
    expect(OTLPExporterMock).toHaveBeenCalledTimes(1);
    expect(OTLPExporterMock).toHaveBeenCalledWith({
      url: 'http://localhost:4318/v1/traces',
    });

    expect(ConsoleExporterMock).toHaveBeenCalledTimes(1);
    expect(SimpleProcessorMock).toHaveBeenCalledTimes(1);
    expect(AutoInstrMock).toHaveBeenCalledTimes(1);
    expect(NodeSDKMock).toHaveBeenCalledTimes(1);

    expect(NodeSDKMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        traceExporter: expect.any(Object) as unknown,
        spanProcessor: expect.any(Object) as unknown,
        instrumentations: [['auto-inst']],
      }),
    );

    expect(tracingModule.otelSDK).toBeDefined();
  });

  it('exposes start/shutdown on the exported SDK', async () => {
    await Promise.resolve(tracingModule.otelSDK.start() as unknown);
    await Promise.resolve(tracingModule.otelSDK.shutdown() as unknown);
  });
});
