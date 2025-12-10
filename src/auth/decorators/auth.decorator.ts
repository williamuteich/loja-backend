import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';

export function Auth(...roles: Role[]) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(...roles),
        ApiBearerAuth('JWT-auth'),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiForbiddenResponse({ description: 'Forbidden resource' }),
    );
}
