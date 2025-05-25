/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.constant';

interface RequestWithUser extends Request {
  user?: { role?: Role };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required by the route (@Roles(...))
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public route if no roles specified
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Extract user from request
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRole = request.user?.role as Role | undefined;
    console.log(userRole);
    if (!userRole) {
      throw new ForbiddenException(
        'User role was not found in request context',
      );
    }

    // Authorize: user must match at least one required role
    const allowed = requiredRoles.includes(userRole);
    if (!allowed) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    return true;
  }
}
