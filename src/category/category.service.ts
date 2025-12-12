import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryErrors } from '../common/errors/app-errors';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({
                data: createCategoryDto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw CategoryErrors.nameAlreadyExists();
                }
            }
            throw CategoryErrors.failedToCreate();
        }
    }

    async findAll(skip: number = 0, take: number = 10) {
        try {
            return await this.prisma.category.findMany({
                skip,
                take,
            });
        } catch (error) {
            throw CategoryErrors.failedToFetchAll();
        }
    }

    async findOne(id: string) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
            });

            if (!category) {
                throw CategoryErrors.notFound(id);
            }

            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw CategoryErrors.failedToFetchOne();
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data: updateCategoryDto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw CategoryErrors.notFound(id);
                }
                if (error.code === 'P2002') {
                    throw CategoryErrors.nameAlreadyExists();
                }
            }
            throw CategoryErrors.failedToUpdate();
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.category.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw CategoryErrors.notFound(id);
                }
            }
            throw CategoryErrors.failedToDelete();
        }
    }
}
