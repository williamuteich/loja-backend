import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/client';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('Social Media')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) { }

  @Auth(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new social media link' })
  @ApiResponse({ status: 201, description: 'Social media created successfully' })
  @ApiResponse({ status: 404, description: 'Store configuration not found' })
  create(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.create(createSocialDto);
  }

  @Get()
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('social_media_all')
  @CacheTTL(30 * 24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Get all social media links' })
  findAll() {
    return this.socialService.findAll();
  }

  @Get(':id')
  @CacheTTL(30 * 24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Get a social media link by ID' })
  @ApiResponse({ status: 200, description: 'Return the social media link' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  findOne(@Param('id') id: string) {
    return this.socialService.findOne(id);
  }

  @Auth(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a social media link' })
  @ApiResponse({ status: 200, description: 'Social media updated successfully' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  update(@Param('id') id: string, @Body() updateSocialDto: UpdateSocialDto) {
    return this.socialService.update(id, updateSocialDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a social media link' })
  @ApiResponse({ status: 200, description: 'Social media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Social media not found' })
  remove(@Param('id') id: string) {
    return this.socialService.remove(id);
  }
}
