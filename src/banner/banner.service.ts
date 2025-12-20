import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { PrismaService } from 'src/database/prisma.service';
import { BannerErrors } from 'src/common/errors/app-errors';
import { IFileStorageService } from 'src/common/interfaces/IFileStorageService';

@Injectable()
export class BannerService {
  constructor(
    private prisma: PrismaService,
    private fileStorage: IFileStorageService
  ) { }

  async create(createBannerDto: CreateBannerDto, files?: { desktopImage?: Express.Multer.File[], mobileImage?: Express.Multer.File[] }) {
    let desktopUrl: string | undefined;
    let mobileUrl: string | undefined;

    if (files?.desktopImage && files.desktopImage.length > 0) {
      desktopUrl = await this.fileStorage.save(files.desktopImage[0], 'banners');
    }

    if (files?.mobileImage && files.mobileImage.length > 0) {
      mobileUrl = await this.fileStorage.save(files.mobileImage[0], 'banners');
    }

    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        ...(desktopUrl ? { imageDesktop: desktopUrl } : {}),
        ...(mobileUrl ? { imageMobile: mobileUrl } : {}),
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    return await this.prisma.banner.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    })

    if (!banner) {
      throw BannerErrors.notFound(id);
    }

    return banner;
  }

  async update(id: string, updateBannerDto: any, files?: { desktopImage?: Express.Multer.File[], mobileImage?: Express.Multer.File[] }) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
      select: { id: true, imageDesktop: true, imageMobile: true },
    });

    if (!existing) {
      throw BannerErrors.notFound(id);
    }

    const data: any = {};

    if (updateBannerDto.title !== undefined && updateBannerDto.title !== '') {
      data.title = updateBannerDto.title;
    }
    if (updateBannerDto.subtitle !== undefined && updateBannerDto.subtitle !== '') {
      data.subtitle = updateBannerDto.subtitle;
    }
    if (updateBannerDto.linkUrl !== undefined && updateBannerDto.linkUrl !== '') {
      data.linkUrl = updateBannerDto.linkUrl;
    }
    if (updateBannerDto.resolutionDesktop !== undefined && updateBannerDto.resolutionDesktop !== '') {
      data.resolutionDesktop = updateBannerDto.resolutionDesktop;
    }
    if (updateBannerDto.resolutionMobile !== undefined && updateBannerDto.resolutionMobile !== '') {
      data.resolutionMobile = updateBannerDto.resolutionMobile;
    }
    if (updateBannerDto.isActive !== undefined) {
      data.isActive = updateBannerDto.isActive;
    }

    if (files?.desktopImage && files.desktopImage.length > 0) {
      if (existing.imageDesktop) {
        await this.fileStorage.delete(existing.imageDesktop);
      }
      data.imageDesktop = await this.fileStorage.save(files.desktopImage[0], 'banners');
    }

    if (files?.mobileImage && files.mobileImage.length > 0) {
      if (existing.imageMobile) {
        await this.fileStorage.delete(existing.imageMobile);
      }
      data.imageMobile = await this.fileStorage.save(files.mobileImage[0], 'banners');
    }

    if (Object.keys(data).length === 0) {
      return this.prisma.banner.findUnique({ where: { id } });
    }

    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw BannerErrors.notFound(id);
    }

    return await this.prisma.banner.delete({
      where: { id },
    });
  }
}
