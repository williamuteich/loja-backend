import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CacheKey, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/client';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';
import { Cache } from 'cache-manager';

@ApiTags('Social Media')
@Controller('social')
export class SocialController {
  constructor(
    private readonly socialService: SocialService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Auth(Role.ADMIN)
  @Post('admin')
  @ApiOperation({ summary: 'Create a new social media link' })
  @ApiResponse({ status: 201, description: 'Social media created successfully' })
  @ApiResponse({ status: 404, description: 'Store configuration not found' })
  async create(@Body() createSocialDto: CreateSocialDto) {
    const result = await this.socialService.create(createSocialDto);
    await this.cacheManager.del('social_media_all');
    return result;
  }

  @Get('public')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('social_media_all')
  @CacheTTL(30 * 24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Get all social media links' })
  findAll() {
    return this.socialService.findAll();
  }

  @Get('public/:id')
  @CacheTTL(30 * 24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Get a social media link by ID' })
  @ApiResponse({ status: 200, description: 'Return the social media link' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  findOne(@Param('id') id: string) {
    return this.socialService.findOne(id);
  }

  @Auth(Role.ADMIN)
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Update a social media link' })
  @ApiResponse({ status: 200, description: 'Social media updated successfully' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  async update(@Param('id') id: string, @Body() updateSocialDto: UpdateSocialDto) {
    const result = await this.socialService.update(id, updateSocialDto);
    await this.cacheManager.del('social_media_all');
    await this.cacheManager.del(`/social/${id}`);
    return result;
  }

  @Auth(Role.ADMIN)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete a social media link' })
  @ApiResponse({ status: 200, description: 'Social media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  async remove(@Param('id') id: string) {
    const result = await this.socialService.remove(id);
    await this.cacheManager.del('social_media_all');
    await this.cacheManager.del(`/social/${id}`);
    return result;
  }
}
