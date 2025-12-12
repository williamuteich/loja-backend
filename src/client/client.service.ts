import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../database/prisma.service';
import { Role, Prisma } from '../../generated/prisma/client';
import { IHashService } from '../common/interfaces/IHashService';
import { ClientErrors } from '../common/errors/app-errors';

@Injectable()
export class ClientService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: IHashService,
    ) { }

    async create(createClientDto: CreateClientDto) {
        try {
            const hashedPassword = await this.hashService.hash(createClientDto.password);

            return await this.prisma.client.create({
                data: {
                    ...createClientDto,
                    password: hashedPassword,
                    role: Role.CLIENT,
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw ClientErrors.emailAlreadyExists();
                }
            }
            throw ClientErrors.failedToCreate();
        }
    }

    async findAll(skip: number = 0, take: number = 10) {
        try {
            return await this.prisma.client.findMany({
                where: {
                    role: Role.CLIENT,
                },
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            throw ClientErrors.failedToFetchAll();
        }
    }

    async findOne(id: string) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id, role: Role.CLIENT },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!client) {
                throw ClientErrors.notFound(id);
            }

            return client;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw ClientErrors.failedToFetchOne();
        }
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        try {
            return await this.prisma.client.update({
                where: { id },
                data: updateClientDto,
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw ClientErrors.notFound(id);
                }
                if (error.code === 'P2002') {
                    throw ClientErrors.emailAlreadyExists();
                }
            }
            throw ClientErrors.failedToUpdate();
        }
    }
}
