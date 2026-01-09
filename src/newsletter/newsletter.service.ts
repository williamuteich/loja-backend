import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { PrismaService } from 'src/database/prisma.service';
import { NewsLetterErrors } from 'src/common/errors/app-errors';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createNewsletterDto: CreateNewsletterDto) {
    const existing = await this.prisma.newsletter.findFirst({
      where: { email: createNewsletterDto.email }
    });

    if (existing) {
      throw NewsLetterErrors.emailAlreadyExists();
    }

    return this.prisma.newsletter.create({
      data: createNewsletterDto,
    });
  }

  async findAll(skip: number = 0, take: number = 10, search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { whatsapp: { contains: search } },
      ];
    }

    return this.prisma.newsletter.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { id },
    })

    if (!newsletter) {
      throw NewsLetterErrors.notFound(id);
    }

    return newsletter;
  }

  async update(id: string, updateNewsletterDto: UpdateNewsletterDto) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw NewsLetterErrors.notFound(id);
    }

    return this.prisma.newsletter.update({
      where: { id },
      data: updateNewsletterDto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw NewsLetterErrors.notFound(id);
    }

    return this.prisma.newsletter.delete({
      where: { id },
    });
  }
}
