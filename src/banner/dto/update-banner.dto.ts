import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBannerDto {
    @ApiProperty({
        description: 'Banner title',
        example: 'Banner Title',
        required: false,
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: 'Banner subtitle',
        example: 'Banner Subtitle',
        required: false,
    })
    @IsString()
    @IsOptional()
    subtitle?: string

    @ApiProperty({
        description: 'Banner link url',
        example: 'https://google.com',
        required: false,
    })
    @IsString()
    @IsOptional()
    linkUrl?: string

    @ApiProperty({
        description: 'Banner resolution desktop',
        example: '1920x1080',
        required: false,
    })
    @IsString()
    @IsOptional()
    resolutionDesktop?: string

    @ApiProperty({
        description: 'Banner resolution mobile',
        example: '600x600',
        required: false,
    })
    @IsString()
    @IsOptional()
    resolutionMobile?: string
}
