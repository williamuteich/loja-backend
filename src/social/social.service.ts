import { Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { PrismaService } from '../database/prisma.service';
import { SocialMediaErrors, StoreConfigurationErrors } from '../common/errors/app-errors';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateSocialDto) {
    const storeConfig = await this.prisma.storeConfiguration.findFirst();

    if (!storeConfig) {
      throw StoreConfigurationErrors.notFound();
    }

    try {
      const socialMedia = await this.prisma.socialMedia.create({
        data: {
          ...dto,
          storeConfigId: storeConfig.id,
        },
      });

      if (!socialMedia) {
        throw SocialMediaErrors.failedToCreate();
      }

      return socialMedia;
    } catch (error) {
      if ((error as any).code === 'P2002') {
        throw SocialMediaErrors.alreadyExists();
      }
      throw SocialMediaErrors.failedToCreate();
    }
  }

  async findAll() {
    return this.prisma.socialMedia.findMany();
  }

  async findOne(id: string) {
    const socialMedia = await this.prisma.socialMedia.findUnique({
      where: { id },
    });

    if (!socialMedia) {
      throw SocialMediaErrors.notFound(id);
    }

    return socialMedia;
  }

  async update(id: string, dto: UpdateSocialDto) {
    await this.findOne(id);

    try {
      const updated = await this.prisma.socialMedia.update({
        where: { id },
        data: dto,
      });

      if (!updated) {
        throw SocialMediaErrors.failedToUpdate();
      }

      return updated;
    } catch (error) {
      if ((error as any).code === 'P2002') {
        throw SocialMediaErrors.alreadyExists();
      }
      throw SocialMediaErrors.failedToUpdate();
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.socialMedia.delete({
        where: { id },
      });
      return { message: 'Social media deleted successfully' };
    } catch (error) {
      throw SocialMediaErrors.failedToDelete();
    }
  }
}
