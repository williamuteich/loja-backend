import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, MaxLength, MinLength } from "class-validator"

export class CreateNewsletterDto {
    @ApiProperty({
        example: 'joao.silva@example.com',
        description: 'Client email address',
    })
    @IsEmail()
    @MinLength(5)
    @MaxLength(60)
    email: string

    @ApiProperty({
        example: '(51)99661-5024',
        description: 'Client whatsapp number',
    })
    @IsOptional()
    @MinLength(14)
    @MaxLength(14)
    whatsapp: string
}
