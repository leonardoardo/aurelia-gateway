import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MetricsInterceptor } from './infrastructure/observability/metrics.interceptor';
import { otelSDK } from './infrastructure/observability/tracing';

async function bootstrap() {
  otelSDK.start();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(app.get(MetricsInterceptor));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
