import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 20)
    password: string;
}
