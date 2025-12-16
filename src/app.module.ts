import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { ClientModule } from './client/client.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';

import { CacheModule } from '@nestjs/cache-manager';
import { BannerModule } from './banner/banner.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 86400,
    }),
    DatabaseModule,
    ClientModule,
    TeamMembersModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    BannerModule,
    NewsletterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
