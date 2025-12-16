import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateStoreConfigurationDto {
  @ApiProperty({ description: 'Status do site (ativo/inativo)', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ description: 'Modo manutenção', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  maintenanceMode?: boolean;

  @ApiProperty({ description: 'Mensagem exibida em modo manutenção', required: false })
  @IsString()
  @IsOptional()
  maintenanceMessage?: string;

  @ApiProperty({ description: 'Nome da loja', example: 'Minha Loja de Cosméticos' })
  @IsString()
  storeName: string;

  @ApiProperty({ description: 'CNPJ da loja', example: '12.345.678/0001-90' })
  @IsString()
  cnpj: string;

  @ApiProperty({ description: 'Descrição da loja', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'WhatsApp de contato', required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ description: 'URL do logo', required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ description: 'URL do favicon', required: false })
  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @ApiProperty({ description: 'Embed do Google Maps', required: false })
  @IsString()
  @IsOptional()
  googleMapsEmbedUrl?: string;

  @ApiProperty({ description: 'Horário de funcionamento', required: false, example: 'Seg–Sex, 9h às 18h' })
  @IsString()
  @IsOptional()
  businessHours?: string;

  @ApiProperty({ description: 'Email de contato', example: 'contato@loja.com' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: 'Notificar novos pedidos por email', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  notifyNewOrders?: boolean;

  @ApiProperty({ description: 'Newsletter automática habilitada', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  automaticNewsletter?: boolean;

  @ApiProperty({ description: 'Título SEO padrão', required: false })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({ description: 'Descrição SEO padrão', required: false })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({ description: 'Palavras-chave SEO', required: false })
  @IsString()
  @IsOptional()
  seoKeywords?: string;

  @ApiProperty({ description: 'Moeda padrão', example: 'BRL', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Locale padrão', example: 'pt-BR', required: false })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiProperty({ description: 'Redes Sociais (JSON array)', required: false, example: '[{"platform":"Instagram","url":"..."}]' })
  @IsOptional()
  @Type(() => Object)
  @Transform(({ value }) => {
    if (!value || value === '' || value === 'null') return undefined; // Handle 'null' string
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return undefined; }
    }
    return value;
  })
  socialMedias?: any;
}
