import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Post()
  @Auth(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Create a new product (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Geladeira Frost Free 450L' },
        description: { type: 'string', example: 'Geladeira Frost Free com controle digital' },
        price: { type: 'number', example: 3500.9 },
        discountPrice: { type: 'number', example: 2999.9 },
        specs: { type: 'object', example: { voltage: '110V' } },
        brandId: { type: 'string', format: 'uuid', nullable: true },
        categoryIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        variants: {
          type: 'string',
          description: 'JSON array with variants [{"color":"Blue","quantity":20},{"color":"Red","quantity":5}]',
          example: '[{"color":"Blue","quantity":20},{"color":"Red","quantity":5}]',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['title', 'price', 'variants'],
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const result = await this.productService.create(createProductDto, files);
    await this.cacheManager.del('products_all');
    return result;
  }

  @Get()
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('products_all')
  @CacheTTL(24 * 60 * 60 * 1000) // 1 day
  @ApiOperation({ summary: 'Get all products (public)' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.productService.findAll(skip, take);
  }

  @Get(':id')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheTTL(24 * 60 * 60 * 1000) // 1 day
  @ApiOperation({ summary: 'Get a product by ID (public)' })
  @ApiResponse({ status: 200, description: 'Return the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Update a product (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Geladeira Frost Free 450L' },
        description: { type: 'string', example: 'Geladeira Frost Free com controle digital' },
        price: { type: 'number', example: 3500.9 },
        discountPrice: { type: 'number', example: 2999.9 },
        specs: { type: 'object', example: { voltage: '110V' } },
        brandId: { type: 'string', format: 'uuid', nullable: true },
        categoryIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        variants: {
          type: 'string',
          description: 'JSON array with variants [{"color":"Blue","quantity":20},{"color":"Red","quantity":5}]',
          example: '[{"color":"Blue","quantity":20},{"color":"Red","quantity":5}]',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const result = await this.productService.update(id, updateProductDto, files);
    await this.cacheManager.del('products_all');
    await this.cacheManager.del(`/product/${id}`);
    return result;
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a product (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async remove(@Param('id') id: string) {
    const result = await this.productService.remove(id);
    await this.cacheManager.del('products_all');
    await this.cacheManager.del(`/product/${id}`);
    return result;
  }
}
