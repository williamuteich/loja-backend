import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../generated/prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthErrors } from '../../common/errors/app-errors';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw AuthErrors.userNotAuthenticated();
        }

        const hasRole = requiredRoles.some((role) => user.role === role);

        if (!hasRole) {
            throw AuthErrors.accessDenied(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}
