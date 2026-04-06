import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: { sub: string };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const res = context.switchToHttp().getResponse<Response>();

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const normalizedIp = ip === '::1' ? '127.0.0.1' : ip;

    return next.handle().pipe(
      tap(async () => {
        // log response ปกติ
        await this.logRequest(req, res.statusCode, normalizedIp);
      }),
      catchError((err) => {
        // log error 500 ด้วย
        this.logRequest(
          req,
          err.status || 500,
          normalizedIp,
          err.message,
        );
        return throwError(() => err);
      }),
    );
  }

  private async logRequest(
    req: CustomRequest,
    statusCode: number,
    ip: string | undefined,
    errorMessage?: string,
  ) {
    try {
      const isGetRequest = req.method === 'GET';
      const isAdminRoute =
        req.originalUrl.includes('/admin') ||
        req.originalUrl.includes('/activity-log');

      if (isGetRequest && !isAdminRoute) return; // ข้าม GET ปกติ

      await this.activityLogService.create({
        user_id: req.user?.sub || undefined,
        action: `API_${req.method}`,
        method: req.method,
        route: req.originalUrl,
        status_code: statusCode,
        ip_address: ip,
        metadata: errorMessage ? { error: errorMessage } : undefined,
      });
    } catch (err) {
      console.error('⚠️ Activity Log Error:', err.message);
    }
  }
}
