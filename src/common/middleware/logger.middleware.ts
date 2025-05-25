import { Request, Response, NextFunction } from 'express';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';

  console.log(
    `[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip} - ${userAgent}`,
  );

  // Track response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
}
