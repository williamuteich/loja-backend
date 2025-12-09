import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { TeamMembersModule } from './team-members/team-members.module';

@Module({
  imports: [ClientModule, TeamMembersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
