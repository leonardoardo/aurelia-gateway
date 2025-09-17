import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  readonly httpRequestDuration: Histogram<string>;
  readonly kafkaConsumerLag: Gauge<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.kafkaConsumerLag = new Gauge({
      name: 'kafka_consumer_lag',
      help: 'Kafka consumer lag by topic/partition',
      labelNames: ['topic', 'partition'],
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
