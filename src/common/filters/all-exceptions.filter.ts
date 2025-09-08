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

    // Build a rich error payload for logs
    let errorResponse: any;
    if (isHttpException) {
      errorResponse = (exception as HttpException).getResponse();
    } else if (exception instanceof Error) {
      errorResponse = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    } else {
      errorResponse = { message: 'Unknown error', value: String(exception) };
    }

    // Log with request context
    this.logger.error(
      `Unhandled exception at ${request.method} ${request.originalUrl}`,
      'ALL_EXCEPTIONS',
      typeof errorResponse === 'string'
        ? errorResponse
        : JSON.stringify({
            status,
            error: errorResponse,
            params: request.params,
            query: request.query,
            body: request.body,
          }),
    );

    // Prepare client-safe body
    const message = isHttpException
      ? (exception as HttpException).message
      : 'Internal server error';
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
