import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

const otlpExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});


const consoleExporter = new ConsoleSpanExporter();

export const otelSDK = new NodeSDK({
    traceExporter: otlpExporter,
    spanProcessor: new SimpleSpanProcessor(consoleExporter),
    instrumentations: [getNodeAutoInstrumentations()],
});
