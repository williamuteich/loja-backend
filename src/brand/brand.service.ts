import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandErrors } from '../common/errors/app-errors';

@Injectable()
export class BrandService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBrandDto: CreateBrandDto) {
        try {
            return await this.prisma.brand.create({
                data: createBrandDto,
            });
        } catch (error) {
            if ((error as any).code === 'P2002') {
                throw BrandErrors.nameAlreadyExists();
            }
            throw BrandErrors.failedToCreate();
        }
    }

    async findAll(skip: number = 0, take: number = 10, search?: string) {
        const where: any = {};

        if (search) {
            where.name = { contains: search };
        }

        return await this.prisma.brand.findMany({
            where,
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
        return await this.prisma.brand.findMany({
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

    async findAllAll() {
        return await this.prisma.brand.findMany({
            orderBy: {
                name: 'asc',
            },
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
        const brand = await this.prisma.brand.findUnique({
            where: { id },
        });

        if (!brand) {
            throw BrandErrors.notFound(id);
        }

        return brand;
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        const existing = await this.prisma.brand.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw BrandErrors.notFound(id);
        }

        try {
            return await this.prisma.brand.update({
                where: { id },
                data: updateBrandDto,
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
                throw BrandErrors.nameAlreadyExists();
            }
            throw BrandErrors.failedToUpdate();
        }
    }

    async remove(id: string) {
        const existing = await this.prisma.brand.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw BrandErrors.notFound(id);
        }

        return await this.prisma.brand.delete({
            where: { id },
        });
    }
}
