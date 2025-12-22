import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UploadedFiles, 
  UseInterceptors,
  Inject
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { CacheKey, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('admin')
  @Auth(Role.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'desktopImage', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 },
  ]))
  @ApiOperation({ summary: 'Create a new banner (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Home hero banner' },
        subtitle: { type: 'string', example: 'Subtitle for hero banner' },
        linkUrl: { type: 'string', example: 'https://meusite.com/produto/123' },
        resolutionDesktop: { type: 'string', example: '1920x1080' },
        resolutionMobile: { type: 'string', example: '600x600' },
        desktopImage: {
          type: 'string',
          format: 'binary',
          description: 'Desktop banner image',
        },
        mobileImage: {
          type: 'string',
          format: 'binary',
          description: 'Mobile banner image',
        },
      },
      required: ['title'],
    },
  })
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() files: { desktopImage?: Express.Multer.File[], mobileImage?: Express.Multer.File[] },
  ) {
    const result = this.bannerService.create(createBannerDto, files);
    this.cacheManager.del('banners_all');
    this.cacheManager.del('banners_public');
    return result;
  }

  @Get('public')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('banners_public')
  @CacheTTL(3600000)
  @ApiOperation({ summary: 'Get all active banners (public)' })
  @ApiResponse({ status: 200, description: 'Return all active banners' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAllPublic(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.bannerService.findAllPublic(skip, take);
  }

  @Get('admin')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('banners_all')
  @CacheTTL(3600000)
  @ApiOperation({ summary: 'Get all banners (admin)' })
  @ApiResponse({ status: 200, description: 'Return all banners (admin)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Auth(Role.ADMIN, Role.COLLABORATOR)
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.bannerService.findAll(skip, take);
  }

  @Get('public/:id')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheTTL(3600000)
  @ApiOperation({ summary: 'Get a banner by ID (public)' })
  @ApiResponse({ status: 200, description: 'Return the banner' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch('admin/:id')
  @Auth(Role.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'desktopImage', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 },
  ]))
  @ApiOperation({ summary: 'Update a banner (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Home hero banner' },
        subtitle: { type: 'string', example: 'Subtitle for hero banner' },
        linkUrl: { type: 'string', example: 'https://meusite.com/produto/123' },
        resolutionDesktop: { type: 'string', example: '1920x1080' },
        resolutionMobile: { type: 'string', example: '600x600' },
        desktopImage: {
          type: 'string',
          format: 'binary',
          description: 'Desktop banner image (optional)',
        },
        mobileImage: {
          type: 'string',
          format: 'binary',
          description: 'Mobile banner image (optional)',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: any,
    @UploadedFiles() files: { desktopImage?: Express.Multer.File[], mobileImage?: Express.Multer.File[] },
  ) {
    const result = await this.bannerService.update(id, updateBannerDto, files);
    await this.cacheManager.del('banners_all');
    await this.cacheManager.del('banners_public');
    await this.cacheManager.del(`/banner/${id}`);
    return result;
  }

  @Delete('admin/:id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a banner (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  async remove(@Param('id') id: string) {
    const result = await this.bannerService.remove(id);
    await this.cacheManager.del('banners_all');
    await this.cacheManager.del('banners_public');
    await this.cacheManager.del(`/banner/${id}`);
    return result;
  }
}
