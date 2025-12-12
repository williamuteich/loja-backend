import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Post()
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new brand (ADMIN only)' })
    @ApiResponse({ status: 201, description: 'Brand created successfully' })
    @ApiResponse({ status: 409, description: 'Brand name already exists' })
    create(@Body() createBrandDto: CreateBrandDto) {
        return this.brandService.create(createBrandDto);
    }

    @Get()
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    @ApiOperation({ summary: 'Get all brands (ADMIN/COLLABORATOR only)' })
    @ApiResponse({ status: 200, description: 'Return all brands' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    findAll(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.brandService.findAll(skip, take);
    }

    @Get(':id')
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    @ApiOperation({ summary: 'Get a brand by ID (ADMIN/COLLABORATOR only)' })
    @ApiResponse({ status: 200, description: 'Return the brand' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    findOne(@Param('id') id: string) {
        return this.brandService.findOne(id);
    }

    @Patch(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Update a brand (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Brand updated successfully' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return this.brandService.update(id, updateBrandDto);
    }

    @Delete(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a brand (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    remove(@Param('id') id: string) {
        return this.brandService.remove(id);
    }
}
