import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { IHashService } from '../common/interfaces/IHashService';

@Injectable()
export class TeamMembersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: IHashService,
  ) { }

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    try {
      const hashedPassword = await this.hashService.hash(createTeamMemberDto.password);

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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create team member');
    }
  }

  async findAll(skip: number = 0, take: number = 10) {
    try {
      return await this.prisma.team.findMany({
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
      throw new InternalServerErrorException('Failed to fetch team members');
    }
  }

  async findOne(id: string) {
    try {
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
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      return teamMember;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch team member');
    }
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Team member with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to update team member');
    }
  }

  async remove(id: string) {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Team member with ID ${id} not found`);
        }
      }
      throw new InternalServerErrorException('Failed to delete team member');
    }
  }
}
