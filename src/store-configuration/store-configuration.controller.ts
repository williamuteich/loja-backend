import { Body, Controller, Get, Patch, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { StoreConfigurationService } from './store-configuration.service';
import { UpdateStoreConfigurationDto } from './dto/update-store-configuration.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/generated/prisma/enums';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@ApiTags('store-configuration')
@Controller('store-configuration')
export class StoreConfigurationController {
  constructor(private readonly storeConfigurationService: StoreConfigurationService) {}

  @Get()
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('store_config_current')
  @CacheTTL(30 * 24 * 60 * 60 * 1000) // 30 days
  @ApiOperation({ summary: 'Get current store configuration (public)' })
  @ApiResponse({ status: 200, description: 'Store configuration retrieved successfully' })
  getCurrent() {
    return this.storeConfigurationService.getCurrent();
  }

  @Patch()
  @Auth(Role.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
  ]))
  @ApiOperation({ summary: 'Update store configuration (ADMIN only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [],
      properties: {
        name: { type: 'string', example: 'My Store' },
        cnpj: { type: 'string', example: '12.345.678/0001-90' },
        phone: { type: 'string', example: '(11) 99999-9999' },
        email: { type: 'string', example: 'contact@mystore.com' },
        description: { type: 'string', example: 'Loja de cosméticos' },
        whatsapp: { type: 'string', example: '(11) 99999-9999' },
        address: { type: 'string', example: 'Rua Exemplo, 123' },
        city: { type: 'string', example: 'São Paulo' },
        state: { type: 'string', example: 'SP' },
        zipCode: { type: 'string', example: '01234-567' },
        isActive: { type: 'boolean', example: true },
        maintenanceMode: { type: 'boolean', example: false },
        maintenanceMessage: { type: 'string', example: 'Under maintenance' },
        businessHours: { type: 'string', example: 'Seg–Sex, 9h às 18h' },
        notifyNewOrders: { type: 'boolean', example: false },
        automaticNewsletter: { type: 'boolean', example: false },
        freeShippingEnabled: { type: 'boolean', example: false },
        freeShippingValue: { type: 'number', example: 150 },
        shippingDeadline: { type: 'number', example: 3 },
        creditCardEnabled: { type: 'boolean', example: true },
        pixEnabled: { type: 'boolean', example: true },
        boletoEnabled: { type: 'boolean', example: false },
        seoTitle: { type: 'string', example: 'Minha Loja' },
        seoDescription: { type: 'string', example: 'Descrição da loja' },
        seoKeywords: { type: 'string', example: 'loja, cosméticos' },
        currency: { type: 'string', example: 'BRL' },
        locale: { type: 'string', example: 'pt-BR' },
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Store configuration updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(
    @Body() dto: UpdateStoreConfigurationDto,
    @UploadedFiles() files: { logo?: Express.Multer.File[] },
  ) {
    const logo = files?.logo?.[0];
    return this.storeConfigurationService.upsert(dto, logo);
  }
}
