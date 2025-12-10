import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('client/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Client login - Role is always CLIENT' })
    @ApiResponse({ status: 200, description: 'Returns JWT access token for client' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async loginClient(@Body() loginDto: LoginDto) {
        return this.authService.loginClient(loginDto.email, loginDto.password);
    }

    @Post('team/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Team member login - Role can be ADMIN or COLLABORATOR' })
    @ApiResponse({ status: 200, description: 'Returns JWT access token for team member' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async loginTeamMember(@Body() loginDto: LoginDto) {
        return this.authService.loginTeamMember(loginDto.email, loginDto.password);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout (client should discard token)' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout() {
        return this.authService.logout();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile (requires authentication)' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Request() req) {
        return req.user;
    }
}
