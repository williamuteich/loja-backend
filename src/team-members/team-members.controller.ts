import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, ForbiddenException, UseInterceptors, Inject } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('team-members')
@Controller('team-members')
export class TeamMembersController {
  constructor(
    private readonly teamMembersService: TeamMembersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Post('admin')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new team member (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Team member created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    const result = await this.teamMembersService.create(createTeamMemberDto);
    await this.cacheManager.del('team_members_all');
    return result;
  }

  @Get('admin')
  @Auth(Role.ADMIN, Role.COLLABORATOR)
  //@UseInterceptors(LoggingCacheInterceptor)
  //@CacheKey('team_members_all')
  //@CacheTTL(3600000)
  @ApiOperation({ summary: 'Get all team members (ADMIN/COLLABORATOR only)' })
  @ApiResponse({ status: 200, description: 'Return all team members' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for team member name' })
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10, search } = query;
    return this.teamMembersService.findAll(skip, take, search);
  }

  @Get('admin/:id')
  @Auth(Role.ADMIN, Role.COLLABORATOR)
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheTTL(3600000)
  @ApiOperation({ summary: 'Get a team member by ID (own data or ADMIN)' })
  @ApiResponse({ status: 200, description: 'Return the team member' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiParam({ name: 'id', description: 'Team member ID' })
  findOne(@Param('id') id: string, @Request() req) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('You can only view your own data');
    }
    return this.teamMembersService.findOne(id);
  }

  @Patch('admin/:id')
  @Auth(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Update a team member (own data or ADMIN)' })
  @ApiResponse({ status: 200, description: 'Team member updated successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiParam({ name: 'id', description: 'Team member ID' })
  async update(@Param('id') id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto, @Request() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    const isOwnAccount = req.user.id === id;

    if (!isAdmin && !isOwnAccount) {
      throw new ForbiddenException('You can only update your own data');
    }

    if (!isAdmin && updateTeamMemberDto.role) {
      throw new ForbiddenException('You are not allowed to change roles');
    }

    const result = await this.teamMembersService.update(id, updateTeamMemberDto);
    await this.cacheManager.del('team_members_all');
    await this.cacheManager.del(`/team-members/${id}`);
    return result;
  }

  @Delete('admin/:id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a team member (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Team member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiParam({ name: 'id', description: 'Team member ID' })
  async remove(@Param('id') id: string) {
    const result = await this.teamMembersService.remove(id);
    await this.cacheManager.del('team_members_all');
    await this.cacheManager.del(`/team-members/${id}`);
    return result;
  }
}
