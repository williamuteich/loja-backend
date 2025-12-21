import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthErrors } from '../../common/errors/app-errors';
import type { Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            const http = context.switchToHttp();
            const res = http.getResponse<Response>();

            if (res && typeof res.clearCookie === 'function') {
                res.clearCookie('access_token');
            }

            if (err) {
                throw err;
            }

            throw AuthErrors.userNotAuthenticated();
        }

        return user;
    }
}
