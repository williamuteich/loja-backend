import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('client/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Client login' })
    @ApiOkResponse({ description: 'Login successful', type: LoginResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async loginClient(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.loginClient(loginDto.email, loginDto.password);

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return { user: result.user };
    }

    @Post('team/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Team member login' })
    @ApiOkResponse({ description: 'Login successful', type: LoginResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async loginTeamMember(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.loginTeamMember(loginDto.email, loginDto.password);

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        return { user: result.user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    @ApiOkResponse({ description: 'Logged out successfully' })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        return { message: 'Logged out successfully' };
    }
}
