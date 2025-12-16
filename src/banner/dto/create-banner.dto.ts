import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class CreateBannerDto {
    @ApiProperty({
        description: 'Banner title',
        example: 'Banner Title',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Banner subtitle',
        example: 'Banner Subtitle',
    })
    @IsString()
    @IsOptional()
    subtitle: string

    @ApiProperty({
        description: 'Banner link url',
        example: 'https://google.com',
    })
    @IsString()
    @IsOptional()
    linkUrl: string

    @ApiProperty({
        description: 'Banner image desktop',
        example: 'https://google.com',
    })
    @IsString()
    @IsOptional()
    imageDesktop: string

    @ApiProperty({
        description: 'Banner image mobile',
        example: 'https://google.com',
    })
    @IsString()
    @IsOptional()
    imageMobile: string

    @ApiProperty({
        description: 'Banner resolution desktop',
        example: '1920x1080',
    })
    @IsString()
    @IsOptional()
    resolutionDesktop: string

    @ApiProperty({
        description: 'Banner resolution mobile',
        example: '600x600',
    })
    @IsString()
    @IsOptional()
    resolutionMobile: string
}
