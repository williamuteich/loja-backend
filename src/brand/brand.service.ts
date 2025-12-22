import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandErrors } from '../common/errors/app-errors';

@Injectable()
export class BrandService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBrandDto: CreateBrandDto) {
        return await this.prisma.brand.create({
            data: createBrandDto,
        });
    }

    async findAll(skip: number = 0, take: number = 10) {
        return await this.prisma.brand.findMany({
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
