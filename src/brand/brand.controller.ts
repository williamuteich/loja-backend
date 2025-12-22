import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
    constructor(
        private readonly brandService: BrandService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Post('admin')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new brand (ADMIN only)' })
    @ApiResponse({ status: 201, description: 'Brand created successfully' })
    @ApiResponse({ status: 409, description: 'Brand name already exists' })
    async create(@Body() createBrandDto: CreateBrandDto) {
        const result = await this.brandService.create(createBrandDto);
        await this.cacheManager.del('brands_all');
        await this.cacheManager.del('brands_public');
        return result;
    }

    @Get('public')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheKey('brands_public')
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get all active brands (public)' })
    @ApiResponse({ status: 200, description: 'Return all active brands' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    findAllPublic(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.brandService.findAllPublic(skip, take);
    }

    @Get('admin')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheKey('brands_all')
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get all brands (admin)' })
    @ApiResponse({ status: 200, description: 'Return all brands (admin)' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    findAll(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.brandService.findAll(skip, take);
    }

    @Get('public/:id')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get a brand by ID (public)' })
    @ApiResponse({ status: 200, description: 'Return the brand' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    findOne(@Param('id') id: string) {
        return this.brandService.findOne(id);
    }

    @Patch('admin/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Update a brand (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Brand updated successfully' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        const result = await this.brandService.update(id, updateBrandDto);
        await this.cacheManager.del('brands_all');
        await this.cacheManager.del('brands_public');
        await this.cacheManager.del(`/brand/${id}`);
        return result;
    }

    @Delete('admin/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a brand (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    async remove(@Param('id') id: string) {
        const result = await this.brandService.remove(id);
        await this.cacheManager.del('brands_all');
        await this.cacheManager.del('brands_public');
        await this.cacheManager.del(`/brand/${id}`);
        return result;
    }
}
