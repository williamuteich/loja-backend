import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSocialDto {
    @ApiProperty({ description: 'Platform name (e.g. Instagram, Facebook)', example: 'Instagram' })
    @IsString()
    @IsNotEmpty()
    platform: string;

    @ApiProperty({ description: 'URL of the profile', example: 'https://instagram.com/myprofile' })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @ApiProperty({ description: 'Is the link active?', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
