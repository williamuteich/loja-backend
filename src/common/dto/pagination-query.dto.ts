import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Number of records to skip', example: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ description: 'Number of records to take', example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({ description: 'Search term to filter results', example: 'search term' })
  @IsOptional()
  @IsString()
  search?: string;
}
