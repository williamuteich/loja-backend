import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({ description: 'Client active status', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
