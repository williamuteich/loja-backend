import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { CreateStoreConfigurationDto } from './dto/create-store-configuration.dto';
import { UpdateStoreConfigurationDto } from './dto/update-store-configuration.dto';
import { StoreConfigurationErrors } from '../common/errors/app-errors';

@Injectable()
export class StoreConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async getCurrent() {
    return this.prisma.storeConfiguration.findFirst();
  }

  async upsert(dto: UpdateStoreConfigurationDto | CreateStoreConfigurationDto, logoFile?: Express.Multer.File) {
    const existing = await this.prisma.storeConfiguration.findFirst();

    let logoUrl: string | undefined;

    if (logoFile) {
      if (existing?.logoUrl && !existing.logoUrl.startsWith('http')) {
        await this.fileStorage.delete(existing.logoUrl);
      }
      logoUrl = await this.fileStorage.save(logoFile, 'store');
    }

    const data = {
      ...dto,
      ...(dto as UpdateStoreConfigurationDto).name && { storeName: (dto as UpdateStoreConfigurationDto).name },
      ...(dto as UpdateStoreConfigurationDto).email && { contactEmail: (dto as UpdateStoreConfigurationDto).email },
      ...(logoUrl && { logoUrl }),
    };

    delete (data as any).name;
    delete (data as any).email;

    try {
      if (!existing) {
        const result = await this.prisma.storeConfiguration.create({
          data: data as CreateStoreConfigurationDto,
        });
        if (!result) {
          throw StoreConfigurationErrors.failedToCreate();
        }
        return result;
      }

      const result = await this.prisma.storeConfiguration.update({
        where: { id: existing.id },
        data,
      });
      if (!result) {
        throw StoreConfigurationErrors.failedToUpdate();
      }
      return result;
    } catch (error) {
      if (error instanceof StoreConfigurationErrors) {
        throw error;
      }
      throw StoreConfigurationErrors.failedToUpdate();
    }
  }

  async updateLogo(file: Express.Multer.File) {
    const existing = await this.prisma.storeConfiguration.findFirst();

    if (!existing) {
      throw StoreConfigurationErrors.notFound();
    }

    try {
      const logoUrl = await this.fileStorage.save(file, 'store');
      
      const result = await this.prisma.storeConfiguration.update({
        where: { id: existing.id },
        data: { logoUrl },
      });
      
      if (!result) {
        throw StoreConfigurationErrors.failedToUploadLogo();
      }
      
      return result;
    } catch (error) {
      if (error instanceof StoreConfigurationErrors) {
        throw error;
      }
      throw StoreConfigurationErrors.failedToUploadLogo();
    }
  }
}
