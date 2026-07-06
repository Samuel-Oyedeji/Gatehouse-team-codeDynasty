import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private redactUrl(url: string): string {
    try {
      const u = new URL(url, 'http://x');
      if (u.searchParams.has('token')) u.searchParams.set('token', '[REDACTED]');
      return u.pathname + (u.search || '');
    } catch {
      return url;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, ip } = req;
    const url = this.redactUrl(req.url);
    const userAgent = req.headers['user-agent'] ?? 'unknown';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const duration = Date.now() - start;
          this.logger.log(
            JSON.stringify({
              method,
              url,
              statusCode: res.statusCode,
              duration: `${duration}ms`,
              ip,
              userAgent,
            }),
          );
        },
        error: (err) => {
          const duration = Date.now() - start;
          this.logger.error(
            JSON.stringify({
              method,
              url,
              statusCode: err?.status ?? 500,
              duration: `${duration}ms`,
              ip,
              userAgent,
              error: err?.message,
            }),
          );
        },
      }),
    );
  }
}
