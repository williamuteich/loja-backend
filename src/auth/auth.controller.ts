import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    //REMOVER FUTURAMENTE PARA LOGIN DE USUARIO.
    //@Post('client/login')
    //@HttpCode(HttpStatus.OK)
    //@ApiOperation({ summary: 'Client login' })
    //@ApiOkResponse({ description: 'Login successful', type: LoginResponseDto })
    //@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    //async loginClient(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    //    const result = await this.authService.loginClient(loginDto.email, loginDto.password);

    //    res.cookie('access_token', result.access_token, {
    //        httpOnly: true,
    //        secure: process.env.NODE_ENV === 'production',
    //        sameSite: 'strict',
    //        path: '/',
    //        maxAge: 24 * 60 * 60 * 1000,
    //    });

    //    return { user: result.user };
    //}

    @Post('team/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Team member login' })
    @ApiOkResponse({ description: 'Login successful', type: LoginResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async loginTeamMember(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        console.log('Login attempt for team member:', loginDto.email);
        const result = await this.authService.loginTeamMember(loginDto.email, loginDto.password);

        console.log('Setting cookie for user:', result.user.id);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 1000,
        });


        return { user: result.user };
    }

    @Get('me')
    @Auth()
    @ApiOperation({ summary: 'Get current authenticated user' })
    @ApiOkResponse({ description: 'Current user information' })
    async getCurrentUser(@CurrentUser() user: JwtPayload) {
        const currentUser = await this.authService.getCurrentUser(user.sub, user.role);
        return currentUser;
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
