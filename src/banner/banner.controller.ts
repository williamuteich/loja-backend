import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @Auth(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
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
        imageDesktop: { type: 'string', example: 'https://cdn.meusite.com/banner-desktop.jpg' },
        imageMobile: { type: 'string', example: 'https://cdn.meusite.com/banner-mobile.jpg' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional files: [0] desktop image, [1] mobile image',
        },
      },
      required: ['title'],
    },
  })
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.bannerService.create(createBannerDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners (public)' })
  @ApiResponse({ status: 200, description: 'Return all banners' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.bannerService.findAll(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a banner by ID (public)' })
  @ApiResponse({ status: 200, description: 'Return the banner' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
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
        imageDesktop: { type: 'string', example: 'https://cdn.meusite.com/banner-desktop.jpg' },
        imageMobile: { type: 'string', example: 'https://cdn.meusite.com/banner-mobile.jpg' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional files: [0] desktop image, [1] mobile image',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.bannerService.update(id, updateBannerDto, files);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a banner (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
