import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (payload.role === 'SuperAdmin') {
        next();
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
