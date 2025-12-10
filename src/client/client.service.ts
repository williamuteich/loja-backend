import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createClientDto: CreateClientDto) {
        return this.prisma.client.create({
            data: {
                ...createClientDto,
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
        return this.prisma.client.findMany({
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
        return this.prisma.client.findUnique({
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
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        return this.prisma.client.update({
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
}
