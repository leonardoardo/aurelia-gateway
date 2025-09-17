import { Test, TestingModule } from '@nestjs/testing';
import { MetricsModule } from '../../../infrastructure/observability/metrics.module';
import { MetricsController } from '../../../infrastructure/observability/metrics.controller';
import { MetricsService } from '../../../infrastructure/observability/metrics.service';
import { MetricsInterceptor } from '../../../infrastructure/observability/metrics.interceptor';

describe('MetricsModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [MetricsModule],
    }).compile();
  });

  it('should expose MetricsController', () => {
    const controller = moduleRef.get<MetricsController>(MetricsController);
    expect(controller).toBeDefined();
  });

  it('should provide MetricsService', () => {
    const service = moduleRef.get<MetricsService>(MetricsService);
    expect(service).toBeDefined();
  });

  it('should provide MetricsInterceptor', () => {
    const interceptor = moduleRef.get<MetricsInterceptor>(MetricsInterceptor);
    expect(interceptor).toBeDefined();
  });
});
