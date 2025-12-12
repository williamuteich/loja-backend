import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Category name', example: 'Eletrônicos' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
}
