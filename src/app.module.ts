import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ClientModule, TeamMembersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
