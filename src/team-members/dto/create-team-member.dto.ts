import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamMemberDto {
    @ApiProperty({ description: 'Name of the team member', example: 'John' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    name: string;

    @ApiProperty({ description: 'Last name of the team member', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    lastName: string;

    @ApiProperty({ description: 'Email of the team member', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password of the team member (min 6 characters)', example: 'SecurePass123' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string;
}