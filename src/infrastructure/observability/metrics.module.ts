// src/app.module.ts
import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsInterceptor } from './metrics.interceptor';

@Module({
    providers: [MetricsService, MetricsInterceptor],
    controllers: [MetricsController]
})
export class MetricsModule { }
