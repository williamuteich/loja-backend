import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ProductQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Filter by category name' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Search by title or description' })
    @IsOptional()
    @IsString()
    search?: string;
}
