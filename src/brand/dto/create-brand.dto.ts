import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
    @ApiProperty({ description: 'Brand name', example: 'Nike' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
}
