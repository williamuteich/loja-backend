import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BcryptHashService } from '../common/services/hash/bcrypt-hash.service';
import { JwtTokenService } from '../common/services/jwt/jwt-token.service';
import { IHashService } from '../common/interfaces/IHashService';
import { IJwtService } from '../common/interfaces/IJwtService';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('jwt.secret'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
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
    ],
    exports: [AuthService],
})
export class AuthModule { }
