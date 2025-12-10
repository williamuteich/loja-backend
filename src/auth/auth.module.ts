import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientModule } from '../client/client.module';
import { TeamMembersModule } from '../team-members/team-members.module';
import { BcryptHashService } from '../common/services/hash/bcrypt-hash.service';
import { JwtTokenService } from '../common/services/jwt/jwt-token.service';
import { IHashService } from '../common/interfaces/IHashService';
import { IJwtService } from '../common/interfaces/IJwtService';
import { PrismaService } from '../database/prisma.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            signOptions: { expiresIn: '15m' },
        }),
        ClientModule,
        TeamMembersModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: IHashService,
            useClass: BcryptHashService,
        },
        {
            provide: IJwtService,
            useClass: JwtTokenService,
        },
        PrismaService,
    ],
    exports: [AuthService],
})
export class AuthModule { }
