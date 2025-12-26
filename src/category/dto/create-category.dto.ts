import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Category name', example: 'Eletrônicos' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @ApiProperty({ description: 'Category description', example: 'Descrição da categoria' })
    @IsString()
    @IsOptional()
    @Length(3, 255)
    description?: string;

    @ApiPropertyOptional({ description: 'Whether this category should be shown on home', example: false })
    @IsBoolean()
    @IsOptional()
    isHome?: boolean;
}
