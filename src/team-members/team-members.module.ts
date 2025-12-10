import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { BcryptHashService } from '../common/services/hash/bcrypt-hash.service';
import { IHashService } from '../common/interfaces/IHashService';

@Module({
  controllers: [TeamMembersController],
  providers: [
    TeamMembersService,
    {
      provide: IHashService,
      useClass: BcryptHashService,
    },
  ],
  exports: [TeamMembersService]
})
export class TeamMembersModule { }
