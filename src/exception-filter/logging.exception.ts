// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { ActivityLogService } from './activity-log.service';

// @Catch()
// export class GlobalLoggingFilter implements ExceptionFilter {
//   constructor(private readonly activityLogService: ActivityLogService) {}

//   async catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const req = ctx.getRequest<Request>();
//     const res = ctx.getResponse<Response>();
//     const logContext = (req as any)._logContext || {};
//     const statusCode =
//       exception instanceof HttpException ? exception.getStatus() : 500;
//     const errorMessage =
//       exception instanceof HttpException
//         ? (exception.getResponse() as any)?.message || exception.message
//         : (exception as any)?.message || 'Internal server error';

//     logContext.statusCode = statusCode;
//     logContext.errorMessage = errorMessage;

//     try {
//       await this.activityLogService.create({
//         user_id: (req as any).user?.sub,
//         action: `API_${req.method}`,
//         method: req.method,
//         route: req.originalUrl,
//         status_code: logContext.statusCode,
//         ip_address:
//           (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
//           req.socket.remoteAddress ||
//           req.ip ||
//           '127.0.0.1',
//         metadata: logContext.errorMessage
//           ? { error: logContext.errorMessage }
//           : undefined,
//       });
//     } catch (err) {
//       console.error('⚠️ Activity Log Error:', err.message);
//     }

//     // ส่ง response ตามปกติ
//     res.status(statusCode).json({
//       statusCode,
//       message: errorMessage,
//     });
//   }
// }
