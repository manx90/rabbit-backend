import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../utils/logger.service';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new LoggerService();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';

  logger.info(`${method} ${originalUrl} - ${ip} - ${userAgent}`, 'REQUEST');

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`,
      'RESPONSE',
    );
  });

  next();
}
