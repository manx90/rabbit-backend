/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Guard to protect routes that should only be accessible by SuperAdmin users
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  private readonly logger = new Logger(SuperAdminGuard.name);

  constructor(private jwtService: JwtService) {}

  /**
   * Check if the request can be processed by verifying the user has SuperAdmin role
   * @param context The execution context
   * @returns Boolean indicating if the request can proceed
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = await Promise.resolve(this.extractTokenFromHeader(request));

    if (!token) {
      this.logger.warn('Access attempt without token');
      throw new UnauthorizedException('Authentication required');
    }

    try {
      // Verify and decode the JWT token
      interface JwtPayload {
        role?: string;
        username?: string;
        sub?: string;
      }
      const payload = this.jwtService.verify(token);

      // Check if the user has the SuperAdmin role
      if (payload?.role !== 'SuperAdmin') {
        this.logger.warn(
          `Unauthorized access attempt by user with role: ${payload?.role}`,
        );
        throw new UnauthorizedException(
          'Only SuperAdmin users can perform this action',
        );
      }

      // Add user info to request for potential use in controllers

      request['user'] = {
        username: payload.username,
        userId: payload.sub,
        role: payload.role,
      };
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Authentication error: ${errorMessage}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Extract JWT token from the request header
   * @param request The HTTP request
   * @returns The token if found, undefined otherwise
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
