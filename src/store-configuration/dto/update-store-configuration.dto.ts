import { IsOptional, IsString, IsBoolean, IsEmail } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreConfigurationDto {
    @ApiProperty({ description: 'Nome da loja', example: 'My Store', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'CNPJ da loja', example: '12.345.678/0001-90', required: false })
    @IsString()
    @IsOptional()
    cnpj?: string;

    @ApiProperty({ description: 'Descrição da loja', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Telefone de contato', example: '(11) 99999-9999', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ description: 'WhatsApp de contato', required: false })
    @IsString()
    @IsOptional()
    whatsapp?: string;

    @ApiProperty({ description: 'Email de contato', example: 'contact@mystore.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Endereço', example: 'Rua Exemplo, 123', required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ description: 'Cidade', example: 'São Paulo', required: false })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ description: 'Estado', example: 'SP', required: false })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ description: 'CEP', example: '01234-567', required: false })
    @IsString()
    @IsOptional()
    zipCode?: string;

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

    @ApiProperty({ description: 'Horário de funcionamento', example: 'Seg–Sex, 9h às 18h', required: false })
    @IsString()
    @IsOptional()
    businessHours?: string;

    @ApiProperty({ description: 'Notificar novos pedidos por email', default: false, required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    notifyNewOrders?: boolean;

    @ApiProperty({ description: 'Newsletter automática', default: false, required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    automaticNewsletter?: boolean;

    @ApiProperty({ description: 'Título SEO', required: false })
    @IsString()
    @IsOptional()
    seoTitle?: string;

    @ApiProperty({ description: 'Descrição SEO', required: false })
    @IsString()
    @IsOptional()
    seoDescription?: string;

    @ApiProperty({ description: 'Palavras-chave SEO', required: false })
    @IsString()
    @IsOptional()
    seoKeywords?: string;

    @ApiProperty({ description: 'Redes Sociais (JSON array)', required: false, example: '[{"platform":"Instagram","url":"..."}]' })
    @IsOptional()
    @Type(() => Object)
    @Transform(({ value }) => {
        if (!value || value === '' || value === 'null') return undefined;
        if (typeof value === 'string') {
            try { return JSON.parse(value); } catch { return undefined; }
        }
        return value;
    })
    socialMedias?: any;

    @ApiProperty({ description: 'Moeda', example: 'BRL', required: false })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({ description: 'Locale', example: 'pt-BR', required: false })
    @IsString()
    @IsOptional()
    locale?: string;
}