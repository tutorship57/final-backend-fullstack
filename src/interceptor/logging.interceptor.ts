import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: {
    sub: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const res = context.switchToHttp().getResponse<Response>();

    // 1. ดึง IP Address (รองรับทั้ง Proxy และ Local)
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const normalizedIp = ip === '::1' ? '127.0.0.1' : ip;

    return next.handle().pipe(
      tap(async () => {
        try {
          const isGetRequest = req.method === 'GET';
          const isAdminRoute =
            req.originalUrl.includes('/admin') ||
            req.originalUrl.includes('/activity-log');

          if (isGetRequest && !isAdminRoute) {
            return; // ข้ามการ Log ถ้าไม่ใช่เรื่องสำคัญ
          }

          await this.activityLogService.create({
            user_id: req.user?.sub || undefined,
            action: `API_${req.method}`,
            method: req.method,
            route: req.originalUrl,
            status_code: res.statusCode,
            ip_address: normalizedIp,
          });
        } catch (err) {
          console.error('⚠️ Activity Log Error:', err.message);
        }
      }),
    );
  }
}
