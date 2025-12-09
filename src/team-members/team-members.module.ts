import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService, PrismaService],
  exports: [TeamMembersService]
})
export class TeamMembersModule { }
