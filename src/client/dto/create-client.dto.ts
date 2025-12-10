import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({
        description: 'Client first name',
        example: 'João',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Client last name',
        example: 'Silva',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'Client email address',
        example: 'joao.silva@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Client password (6-20 characters)',
        example: 'password123',
        minLength: 6,
        maxLength: 20,
    })
    @IsString()
    @Length(6, 20)
    password: string;
}
