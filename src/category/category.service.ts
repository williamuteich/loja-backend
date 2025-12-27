import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryErrors } from '../common/errors/app-errors';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileStorageService: IFileStorageService,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, file?: any) {
        let imageUrl: string | undefined;

        if (file) {
            imageUrl = await this.fileStorageService.save(file, 'categories');
        }

        try {
            return await this.prisma.category.create({
                data: {
                    ...createCategoryDto,
                    ...(imageUrl ? { imageUrl } : {}),
                },
            });
        } catch (error) {
            if ((error as any).code === 'P2002') {
                throw CategoryErrors.nameAlreadyExists();
            }
            throw CategoryErrors.failedToCreate();
        }
    }

    async findAllHome(skip: number = 0, take: number = 10) {
        return await this.prisma.category.findMany({
            where: {
                isActive: true,
                isHome: true,
            },
            skip,
            take,
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
    }

    async findAll(skip: number = 0, take: number = 10) {
        return await this.prisma.category.findMany({
            skip,
            take,
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
    }

    async findAllPublic(skip: number = 0, take: number = 10) {
        return await this.prisma.category.findMany({
            where: {
                isActive: true,
            },
            skip,
            take,
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw CategoryErrors.notFound(id);
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw CategoryErrors.notFound(id);
        }

        try {
            return await this.prisma.category.update({
                where: { id },
                // DTO e Prisma agora usam o mesmo nome de campo: isHome
                data: {
                    ...updateCategoryDto,
                },
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            });
        } catch (error) {
            if ((error as any).code === 'P2002') {
                throw CategoryErrors.nameAlreadyExists();
            }
            throw CategoryErrors.failedToUpdate();
        }
    }

    async remove(id: string) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            select: { id: true, imageUrl: true },
        });

        if (!existing) {
            throw CategoryErrors.notFound(id);
        }

        if (existing.imageUrl) {
            await this.fileStorageService.delete(existing.imageUrl);
        }

        return await this.prisma.category.delete({
            where: { id },
        });
    }

    async updateImage(id: string, file: any) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw CategoryErrors.notFound(id);
        }

        const imageUrl = await this.fileStorageService.save(file, 'categories');

        return await this.prisma.category.update({
            where: { id },
            data: { imageUrl },
        });
    }
}
