import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/database/prisma.service';
import { BannerErrors } from 'src/common/errors/app-errors';
import { IFileStorageService } from 'src/common/interfaces/IFileStorageService';

@Injectable()
export class BannerService {
  constructor(
    private prisma: PrismaService,
    private fileStorage: IFileStorageService
  ) { }

  async create(createBannerDto: CreateBannerDto, files?: Express.Multer.File[]) {
    const { imageDesktop, imageMobile, ...rest } = createBannerDto;

    let desktopUrl: string | undefined = imageDesktop;
    let mobileUrl: string | undefined = imageMobile;

    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map((file) => this.fileStorage.save(file, 'banners')),
      );

      if (uploadedUrls[0]) {
        desktopUrl = uploadedUrls[0];
      }
      if (uploadedUrls[1]) {
        mobileUrl = uploadedUrls[1];
      }
    }

    return this.prisma.banner.create({
      data: {
        ...rest,
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

  async update(id: string, updateBannerDto: UpdateBannerDto, files?: Express.Multer.File[]) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw BannerErrors.notFound(id);
    }

    const { imageDesktop, imageMobile, ...rest } = updateBannerDto;

    const data: any = { ...rest };
    delete data.files;

    let desktopUrl: string | undefined = imageDesktop as any;
    let mobileUrl: string | undefined = imageMobile as any;

    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map((file) => this.fileStorage.save(file, 'banners')),
      );

      if (uploadedUrls[0]) {
        desktopUrl = uploadedUrls[0];
      }
      if (uploadedUrls[1]) {
        mobileUrl = uploadedUrls[1];
      }
    }

    if (desktopUrl !== undefined) {
      data.imageDesktop = desktopUrl;
    }

    if (mobileUrl !== undefined) {
      data.imageMobile = mobileUrl;
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
