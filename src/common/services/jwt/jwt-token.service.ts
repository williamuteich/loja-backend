import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../interfaces/IJwtService';

@Injectable()
export class JwtTokenService implements IJwtService {
    constructor(private readonly jwtService: JwtService) { }

    async sign(payload: object, expiresIn?: string): Promise<string> {
        const options = expiresIn ? { expiresIn: expiresIn as any } : undefined;
        return this.jwtService.signAsync(payload, options);
    }

    async verify(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}
