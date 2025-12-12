import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: () => LoginUserDto })
  user: LoginUserDto;

  @ApiProperty({ description: 'JWT access token, temporarily exposto para uso no Swagger Authorize' })
  accessToken: string;
}
