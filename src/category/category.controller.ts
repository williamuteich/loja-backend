import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Post('admin')
    @Auth(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Create a new category (ADMIN only)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Eletrônicos' },
                description: { type: 'string', example: 'Description of the category' },
                isHome: { type: 'boolean', example: false, description: 'Whether this category should be shown on home' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['name'],
        },
    })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 409, description: 'Category name already exists' })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const result = await this.categoryService.create(createCategoryDto, file);
        await this.cacheManager.del('categories_all');
        await this.cacheManager.del('categories_public');
        return result;
    }

    @Get('public')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheKey('categories_public')
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get all active categories (public)' })
    @ApiResponse({ status: 200, description: 'Return all active categories' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    findAllPublic(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.categoryService.findAllPublic(skip, take);
    }

    @Get('public/home')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheKey('categories_public_home')
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get all active categories flagged to show on home (public)' })
    @ApiResponse({ status: 200, description: 'Return all active categories with isHome=true' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    findAllHome(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.categoryService.findAllHome(skip, take);
    }

    @Get('admin')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheKey('categories_all')
    @CacheTTL(24 * 60 * 60 * 1000) 
    @ApiOperation({ summary: 'Get all categories (admin)' })
    @ApiResponse({ status: 200, description: 'Return all categories (admin)' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    findAll(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.categoryService.findAll(skip, take);
    }

    @Get('public/:id')
    @UseInterceptors(LoggingCacheInterceptor)
    @CacheTTL(24 * 60 * 60 * 1000)
    @ApiOperation({ summary: 'Get a category by ID (public)' })
    @ApiResponse({ status: 200, description: 'Return the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Patch('admin/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Update a category (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        const result = await this.categoryService.update(id, updateCategoryDto);
        await this.cacheManager.del('categories_all');
        await this.cacheManager.del('categories_public');
        await this.cacheManager.del(`/category/${id}`);
        return result;
    }

    @Delete('admin/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a category (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    async remove(@Param('id') id: string) {
        const result = await this.categoryService.remove(id);
        await this.cacheManager.del('categories_all');
        await this.cacheManager.del('categories_public');
        await this.cacheManager.del(`/category/${id}`);
        return result;
    }

    @Post('admin/:id/image')
    @Auth(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload category image (ADMIN only)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Category image uploaded successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const result = await this.categoryService.updateImage(id, file);
        await this.cacheManager.del('categories_all');
        await this.cacheManager.del('categories_public');
        await this.cacheManager.del(`/category/${id}`);
        return result;
    }
}
