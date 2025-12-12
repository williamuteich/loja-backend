import { Injectable } from '@nestjs/common';
import { IHashService } from '../common/interfaces/IHashService';
import { IJwtService } from '../common/interfaces/IJwtService';
import { PrismaService } from '../database/prisma.service';
import { AuthErrors } from '../common/errors/app-errors';

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
            throw AuthErrors.unauthorized('Invalid credentials');
        }

        const isPasswordValid = await this.hashService.compare(password, client.password);

        if (!isPasswordValid) {
            throw AuthErrors.unauthorized('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = client;

        const payload = {
            sub: userWithoutPassword.id,
            email: userWithoutPassword.email,
            role: userWithoutPassword.role
        };

        const accessToken = await this.jwtService.sign(payload);

        if (!accessToken) {
            throw AuthErrors.unauthorized('Invalid credentials');
        }

        return {
            access_token: accessToken,
            user: userWithoutPassword
        };
    }

    async loginTeamMember(email: string, password: string) {
        const teamMember = await this.prisma.team.findUnique({
            where: { email }
        });

        if (!teamMember) {
            throw AuthErrors.unauthorized('Invalid credentials');
        }

        const isPasswordValid = await this.hashService.compare(password, teamMember.password);

        if (!isPasswordValid) {
            throw AuthErrors.unauthorized('Invalid credentials');
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
            throw AuthErrors.unauthorized('Invalid credentials');
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
