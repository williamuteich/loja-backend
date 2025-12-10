import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IHashService } from '../common/interfaces/IHashService';
import { IJwtService } from '../common/interfaces/IJwtService';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashService: IHashService,
        private readonly jwtService: IJwtService,
        private readonly prisma: PrismaService,
    ) { }

    async loginClient(email: string, password: string) {
        const client = await this.prisma.client.findUnique({
            where: { email }
        });

        if (!client) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.hashService.compare(password, client.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = client;

        const payload = {
            sub: userWithoutPassword.id,
            email: userWithoutPassword.email,
            role: userWithoutPassword.role
        };

        const accessToken = await this.jwtService.sign(payload);

        if (!accessToken) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            access_token: accessToken,
            user: userWithoutPassword
        };
    }

    async loginTeamMember(email: string, password: string) {
        const teamMember = await this.prisma.teamMembers.findUnique({
            where: { email }
        });

        if (!teamMember) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.hashService.compare(password, teamMember.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = teamMember;

        const payload = {
            sub: userWithoutPassword.id,
            email: userWithoutPassword.email,
            role: userWithoutPassword.role
        };

        const expiresIn = process.env.JWT_TEAM_EXPIRES_IN || '1h';

        const accessToken = await this.jwtService.sign(payload, expiresIn);

        if (!accessToken) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            access_token: accessToken,
            user: userWithoutPassword
        };
    }

    async logout() {
        return { message: 'Logged out successfully' };
    }
}
