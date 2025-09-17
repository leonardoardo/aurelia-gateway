import { HealthService } from '../../health/health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it('should return health status', () => {
    expect(service.getHealthStatus()).toEqual({ status: 'ok' });
  });
});
