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
  ) { }

  async getCurrent() {
    return this.prisma.storeConfiguration.findFirst({
      include: { socialMedias: true },
    });
  }

  async upsert(dto: UpdateStoreConfigurationDto | CreateStoreConfigurationDto) {
    const existing = await this.prisma.storeConfiguration.findFirst();

    const data: any = {
      ...dto,
      ...(dto as UpdateStoreConfigurationDto).name && { storeName: (dto as UpdateStoreConfigurationDto).name },
      ...(dto as UpdateStoreConfigurationDto).email && { contactEmail: (dto as UpdateStoreConfigurationDto).email },
    };

    delete data.name;
    delete data.email;

    const socialMedias = data.socialMedias;
    delete data.socialMedias;

    let normalizedSocialMedias: any[] = [];
    if (socialMedias) {
      if (Array.isArray(socialMedias)) {
        normalizedSocialMedias = socialMedias;
      } else if (typeof socialMedias === 'string') {
        try { normalizedSocialMedias = JSON.parse(socialMedias); } catch { }
      }
    }

    try {
      if (!existing) {
        const result = await this.prisma.storeConfiguration.create({
          data: {
            ...(data as CreateStoreConfigurationDto),
            socialMedias: {
              create: normalizedSocialMedias.map(sm => ({
                platform: sm.platform,
                url: sm.url,
                isActive: sm.isActive ?? true,
              })),
            },
          },
          include: { socialMedias: true },
        });
        if (!result) {
          throw StoreConfigurationErrors.failedToCreate();
        }
        return result;
      }

      if (socialMedias !== undefined) {
        await this.prisma.socialMedia.deleteMany({ where: { storeConfigId: existing.id } });
      }

      const result = await this.prisma.storeConfiguration.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(socialMedias !== undefined ? {
            socialMedias: {
              create: normalizedSocialMedias.map(sm => ({
                platform: sm.platform,
                url: sm.url,
                isActive: sm.isActive ?? true,
              })),
            },
          } : {}),
        },
        include: { socialMedias: true },
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
}
