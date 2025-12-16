import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { CreateStoreConfigurationDto } from './dto/create-store-configuration.dto';
import { UpdateStoreConfigurationDto } from './dto/update-store-configuration.dto';

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
        return await this.prisma.storeConfiguration.create({
          data: data as CreateStoreConfigurationDto,
        });
      }

      return await this.prisma.storeConfiguration.update({
        where: { id: existing.id },
        data,
      });
    } catch (error) {
      console.error("Store service upsert - Database error:", error);
      throw error;
    }
  }

  async updateLogo(file: Express.Multer.File) {
    const existing = await this.prisma.storeConfiguration.findFirst();

    if (!existing) {
      throw new Error('Store configuration not found');
    }

    const logoUrl = await this.fileStorage.save(file, 'store');

    return this.prisma.storeConfiguration.update({
      where: { id: existing.id },
      data: { logoUrl },
    });
  }
}
