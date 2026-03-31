import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. What roles are required for this specific route?
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. If no roles are defined, the route is public (or doesn't care about roles)
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the request (usually attached by an AuthGuard previously)
    const { user } = context.switchToHttp().getRequest();

    // 4. Logic Check: Does the user have at least one of the required roles?
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
