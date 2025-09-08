import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../utils/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService = new LoggerService()) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? (exception as HttpException).message
      : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.logError(
      new Error(message, {
        cause: exception instanceof Error ? exception : undefined,
      } as any),
      'ALL_EXCEPTIONS',
      {
        method: request.method,
        url: request.originalUrl,
        status,
      },
    );

    const errorBody = isHttpException
      ? (exception as HttpException).getResponse()
      : {
          statusCode: status,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

    response.status(status).json(errorBody);
  }
}
