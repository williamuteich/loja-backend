import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ProductQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Category name to filter products' })
    @IsOptional()
    @IsString()
    category?: string;
}
