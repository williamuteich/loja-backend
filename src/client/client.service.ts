import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../database/prisma.service';

import { IHashService } from '../common/interfaces/IHashService';
import { ClientErrors } from '../common/errors/app-errors';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class ClientService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: IHashService,
    ) { }

    async create(createClientDto: CreateClientDto) {
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
    }

    async findAll(skip: number = 0, take: number = 10) {
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
    }

    async findOne(id: string) {
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
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        const existing = await this.prisma.client.findUnique({
            where: { id, role: Role.CLIENT },
            select: { id: true },
        });

        if (!existing) {
            throw ClientErrors.notFound(id);
        }

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
    }

    async remove(id: string) {
        const existing = await this.prisma.client.findUnique({
            where: { id, role: Role.CLIENT },
            select: { id: true },
        });

        if (!existing) {
            throw ClientErrors.notFound(id);
        }

        return await this.prisma.client.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
