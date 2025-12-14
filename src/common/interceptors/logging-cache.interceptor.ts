import { Injectable, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
    private readonly logger = new Logger(LoggingCacheInterceptor.name);

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const key = this.trackBy(context);

        if (!key) {
            return next.handle();
        }

        try {
            const value = await this.cacheManager.get(key);
            if (value) {
                this.logger.log(`Fetching from Cache: ${key}`);
                return super.intercept(context, next);
            }
        } catch (error) {
            console.log(error);
        }

        this.logger.log(`Fetching from API: ${key}`);
        return super.intercept(context, next);
    }
}
