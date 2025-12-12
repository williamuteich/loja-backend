import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw BrandErrors.nameAlreadyExists();
                }
            }
            throw BrandErrors.failedToCreate();
        }
    }

    async findAll(skip: number = 0, take: number = 10) {
        try {
            return await this.prisma.brand.findMany({
                skip,
                take,
            });
        } catch (error) {
            throw BrandErrors.failedToFetchAll();
        }
    }

    async findOne(id: string) {
        try {
            const brand = await this.prisma.brand.findUnique({
                where: { id },
            });

            if (!brand) {
                throw BrandErrors.notFound(id);
            }

            return brand;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw BrandErrors.failedToFetchOne();
        }
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        try {
            return await this.prisma.brand.update({
                where: { id },
                data: updateBrandDto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw BrandErrors.notFound(id);
                }
                if (error.code === 'P2002') {
                    throw BrandErrors.nameAlreadyExists();
                }
            }
            throw BrandErrors.failedToUpdate();
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.brand.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw BrandErrors.notFound(id);
                }
            }
            throw BrandErrors.failedToDelete();
        }
    }
}
