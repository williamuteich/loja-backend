import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthErrors } from '../../common/errors/app-errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            if (err) {
                throw err;
            }
            throw AuthErrors.accessDenied('Access denied');
        }

        return user;
    }
}
