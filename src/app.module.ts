// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';
import { MetricsModule } from './infrastructure/observability/metrics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/aurelia'),
    MessageModule,
    MetricsModule,
  ],
})
export class AppModule {}
