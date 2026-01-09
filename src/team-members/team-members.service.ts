import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PrismaService } from '../database/prisma.service';
import { IHashService } from '../common/interfaces/IHashService';
import { TeamMemberErrors } from '../common/errors/app-errors';

@Injectable()
export class TeamMembersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: IHashService,
  ) { }

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    const hashedPassword = await this.hashService.hash(createTeamMemberDto.password);
    try {
      return await this.prisma.team.create({
        data: {
          ...createTeamMemberDto,
          password: hashedPassword,
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
      if ((error as any).code === 'P2002') {
        throw TeamMemberErrors.emailAlreadyExists();
      }
      throw TeamMemberErrors.failedToCreate();
    }
  }

  async findAll(skip: number = 0, take: number = 10, search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { lastName: { contains: search } },
      ];
    }

    return await this.prisma.team.findMany({
      where,
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
    const teamMember = await this.prisma.team.findUnique({
      where: { id },
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

    if (!teamMember) {
      throw TeamMemberErrors.notFound(id);
    }

    return teamMember;
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    const existing = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw TeamMemberErrors.notFound(id);
    }

    try {
      return await this.prisma.team.update({
        where: { id },
        data: updateTeamMemberDto,
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
      if ((error as any).code === 'P2002') {
        throw TeamMemberErrors.emailAlreadyExists();
      }
      throw TeamMemberErrors.failedToUpdate();
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw TeamMemberErrors.notFound(id);
    }

    return await this.prisma.team.delete({
      where: { id },
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
