import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryErrors } from '../common/errors/app-errors';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        return await this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async findAll(skip: number = 0, take: number = 10) {
        return await this.prisma.category.findMany({
            skip,
            take,
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

        return await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw CategoryErrors.notFound(id);
        }

        return await this.prisma.category.delete({
            where: { id },
        });
    }
}
