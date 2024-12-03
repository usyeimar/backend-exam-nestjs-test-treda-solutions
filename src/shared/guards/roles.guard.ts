import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('You do not have the necessary permissions');
    }

    const hasRole = requiredRoles.includes(user.role);

    console.log('requiredRoles', requiredRoles);
    console.log('hasRole', hasRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Role ${requiredRoles.join(' or ')} is required to access this resource`,
      );
    }

    return true;
  }
}
