import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../database/prisma.service';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: IFileStorageService,
  ) {}

  async create(dto: CreateProductDto, files?: any[]) {
    const { variants, categoryIds, imageUrls, brandId, ...rest } = dto;

    let uploadedUrls: string[] = [];
    if (files && files.length > 0) {
      uploadedUrls = await Promise.all(
        files.map((file) => this.fileStorage.save(file, 'products')),
      );
    }

    const allImageUrls = [...(imageUrls ?? []), ...uploadedUrls];

    const normalizedCategoryIds: string[] = Array.isArray(categoryIds)
      ? categoryIds
      : categoryIds
      ? [categoryIds]
      : [];

    let normalizedVariants: any[] = [];
    if (Array.isArray(variants)) {
      normalizedVariants = variants.map((item) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }
        return item;
      }).filter(Boolean) as any[];
    } else if (typeof variants === 'string') {
      try {
        const parsed = JSON.parse(variants);
        normalizedVariants = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        normalizedVariants = [];
      }
    } else if (variants && typeof variants === 'object') {
      normalizedVariants = [variants];
    }

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
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto, files?: any[]) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const { variants, categoryIds, imageUrls, brandId, ...rest } = dto;

    const normalizedCategoryIds: string[] = Array.isArray(categoryIds)
      ? categoryIds
      : categoryIds
      ? [categoryIds]
      : [];

    let normalizedVariants: any[] = [];
    if (Array.isArray(variants)) {
      normalizedVariants = variants.map((item) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }
        return item;
      }).filter(Boolean) as any[];
    } else if (typeof variants === 'string') {
      try {
        const parsed = JSON.parse(variants);
        normalizedVariants = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        normalizedVariants = [];
      }
    } else if (variants && typeof variants === 'object') {
      normalizedVariants = [variants];
    }

    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productCategory.deleteMany({ where: { productId: id } });

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(brandId !== undefined ? { brandId } : {}),
        variants: {
          create: normalizedVariants.map((v) => ({
            color: v.color,
            quantity: v.quantity,
          })),
        },
        images: {
          create: imageUrls?.map((url) => ({ url })) ?? [],
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

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productCategory.deleteMany({ where: { productId: id } });

    return this.prisma.product.delete({ where: { id } });
  }
}
