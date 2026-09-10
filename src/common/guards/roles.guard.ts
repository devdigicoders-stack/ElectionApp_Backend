import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../shared/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();

    // Allow platform staff / super admin users when route requires SUPER_ADMIN
    if (requiredRoles.includes(UserRole.SUPER_ADMIN) && user?.isSuperAdmin) {
      return true;
    }

    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException(
        `Insufficient permissions. Route requires role [${requiredRoles.join(', ')}], but current token has role: "${user?.role || 'none'}" (isSuperAdmin: ${user?.isSuperAdmin ?? false}). Please login with a Super Admin or Leader/Admin account.`,
      );
    }
    return true;
  }
}
