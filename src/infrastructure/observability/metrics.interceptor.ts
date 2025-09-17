import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';
import type { Request, Response } from 'express';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        const durationSeconds = (Date.now() - start) / 1000;

        const method: string = req.method;
        const path: string = req.originalUrl ?? req.url;
        const status: string = String(res.statusCode);

        this.metrics.httpRequestDuration
          .labels(method, path, status)
          .observe(durationSeconds);
      }),
    );
  }
}
