import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from '../../../infrastructure/observability/metrics.controller';
import { MetricsService } from '../../../infrastructure/observability/metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let service: MetricsService;

  beforeEach(async () => {
    const mockMetricsService = {
      getMetrics: jest.fn().mockResolvedValue('mock-metrics'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    service = module.get<MetricsService>(MetricsService);
  });

  it('should call metricsService.getMetrics and return its result', async () => {
    const spy = jest.spyOn(service, 'getMetrics');

    const result = await controller.exposeMetrics();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBe('mock-metrics');
  });
});
