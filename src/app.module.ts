import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [DatabaseModule, ClientModule, TeamMembersModule, AuthModule, CategoryModule, BrandModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
