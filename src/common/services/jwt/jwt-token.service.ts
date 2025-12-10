import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../interfaces/IJwtService';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
    constructor(private readonly jwtService: JwtService) { }

    async sign(payload: JwtPayload, expiresIn?: string): Promise<string> {
        if (expiresIn) {
            return this.jwtService.signAsync(payload, { expiresIn: expiresIn as any });
        }
        return this.jwtService.signAsync(payload);
    }

    async verify(token: string): Promise<JwtPayload> {
        return this.jwtService.verifyAsync(token) as Promise<JwtPayload>;
    }
}
