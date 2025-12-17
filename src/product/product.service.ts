import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../database/prisma.service';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { ProductErrors } from '../common/errors/app-errors';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: IFileStorageService,
  ) { }

  async create(dto: CreateProductDto, files?: any[]) {
    const { variants, categoryIds, imageUrls, brandId, ...rest } = dto;

    let uploadedUrls: string[] = [];
    if (files && files.length > 0) {
      uploadedUrls = await Promise.all(
        files.map((file) => this.fileStorage.save(file, 'products')),
      );
    }

    const allImageUrls = [...(imageUrls ?? []), ...uploadedUrls];

    const normalizedCategoryIds: string[] = categoryIds || [];

    const normalizedVariants: any[] = variants || [];

    return this.prisma.product.create({
      data: {
        ...rest,
        ...(brandId ? { brandId } : {}),
        variants: {
          create: normalizedVariants.map((v) => ({
            color: v.color,
            quantity: v.quantity,
          })),
        },
        images: {
          create: allImageUrls.map((url) => ({ url })),
        },
        categories: {
          create: normalizedCategoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: {
        variants: true,
        images: true,
        categories: {
          include: { category: true },
        },
        brand: true,
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    return this.prisma.product.findMany({
      skip,
      take,
      include: {
        variants: true,
        images: true,
        categories: {
          include: { category: true },
        },
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
        categories: {
          include: { category: true },
        },
        brand: true,
      },
    });

    if (!product) {
      throw ProductErrors.notFound(id);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto, files?: any[]) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });

    if (!existing) {
      throw ProductErrors.notFound(id);
    }

    const { variants, categoryIds, imageUrls, brandId, ...rest } = dto;

    const data: any = { ...rest };
    delete data.files;

    if (brandId !== undefined) {
      data.brandId = brandId;
    }

    if (variants !== undefined) {
      const normalizedVariants: any[] = variants || [];

      await this.prisma.productVariant.deleteMany({ where: { productId: id } });
      data.variants = {
        create: normalizedVariants.map((v) => ({
          color: v.color,
          quantity: v.quantity,
        })),
      };
    }

    if (categoryIds !== undefined) {
      const normalizedCategoryIds: string[] = categoryIds || [];

      await this.prisma.productCategory.deleteMany({ where: { productId: id } });
      data.categories = {
        create: normalizedCategoryIds.map((categoryId) => ({ categoryId })),
      };
    }

    if (imageUrls !== undefined) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      data.images = {
        create: imageUrls.map((url) => ({ url })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        variants: true,
        images: true,
        categories: {
          include: { category: true },
        },
        brand: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });

    if (!existing) {
      throw ProductErrors.notFound;
    }

    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productCategory.deleteMany({ where: { productId: id } });

    return this.prisma.product.delete({ where: { id } });
  }
  async findRelated(id: string, limit: number = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { categories: { select: { categoryId: true } } },
    });

    if (!product) {
      throw ProductErrors.notFound(id);
    }

    const categoryIds = product.categories.map((c) => c.categoryId);

    if (categoryIds.length === 0) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            categories: {
              some: {
                categoryId: { in: categoryIds },
              },
            },
          },
        ],
      },
      take: limit,
      include: {
        images: true,
        variants: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
