import { CallHandler, ExecutionContext } from '@nestjs/common';
import type { Request, Response } from 'express';
import { of } from 'rxjs';
import { MetricsInterceptor } from '../../../infrastructure/observability/metrics.interceptor';
import { MetricsService } from '../../../infrastructure/observability/metrics.service';

type LabelsObserver = { observe: (v: number) => void };
type HistogramLike = {
  labels: (method: string, path: string, status: string) => LabelsObserver;
};

describe('MetricsInterceptor', () => {
  let labelsObserver: LabelsObserver;
  let histogram: HistogramLike;
  let metrics: MetricsService;

  beforeEach(() => {
    labelsObserver = { observe: jest.fn() };
    histogram = { labels: jest.fn().mockReturnValue(labelsObserver) };
    metrics = { httpRequestDuration: histogram } as unknown as MetricsService;
    jest.spyOn(Date, 'now').mockReset();
  });

  it('records metrics using originalUrl and calculates duration correctly', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(3_500);

    const req: Request = {
      method: 'POST',
      originalUrl: '/messages',
      url: '/messages',
    } as unknown as Request;

    const res: Response = { statusCode: 201 } as unknown as Response;

    const http = {
      getRequest: <T extends Request>() => req as T,
      getResponse: <T extends Response>() => res as T,
    };

    const context: ExecutionContext = {
      switchToHttp: () => http,
    } as unknown as ExecutionContext;

    const next: CallHandler = { handle: () => of(null) };

    const interceptor = new MetricsInterceptor(metrics);
    await new Promise<void>((resolve) => {
      next.handle().subscribe({
        complete: resolve,
      });
      interceptor
        .intercept(context, next)
        .subscribe({ complete: () => undefined });
    });

    expect(histogram.labels).toHaveBeenCalledWith('POST', '/messages', '201');
    expect(labelsObserver.observe).toHaveBeenCalledWith(2.5);
  });

  it('falls back to url when originalUrl does not exist', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(10_000)
      .mockReturnValueOnce(10_500);

    const req: Request = {
      method: 'GET',
      url: '/health',
    } as unknown as Request;

    const res: Response = { statusCode: 200 } as unknown as Response;

    const http = {
      getRequest: <T extends Request>() => req as T,
      getResponse: <T extends Response>() => res as T,
    };

    const context: ExecutionContext = {
      switchToHttp: () => http,
    } as unknown as ExecutionContext;

    const next: CallHandler = { handle: () => of(null) };

    const interceptor = new MetricsInterceptor(metrics);
    await new Promise<void>((resolve) => {
      next.handle().subscribe({
        complete: resolve,
      });
      interceptor
        .intercept(context, next)
        .subscribe({ complete: () => undefined });
    });

    expect(histogram.labels).toHaveBeenCalledWith('GET', '/health', '200');
    expect(labelsObserver.observe).toHaveBeenCalledWith(0.5);
  });
});
