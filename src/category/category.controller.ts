import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new category (ADMIN only)' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 409, description: 'Category name already exists' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    @ApiOperation({ summary: 'Get all categories (ADMIN/COLLABORATOR only)' })
    @ApiResponse({ status: 200, description: 'Return all categories' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    findAll(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.categoryService.findAll(skip, take);
    }

    @Get(':id')
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    @ApiOperation({ summary: 'Get a category by ID (ADMIN/COLLABORATOR only)' })
    @ApiResponse({ status: 200, description: 'Return the category' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Update a category (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a category (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
