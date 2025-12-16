import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.newsletterService.findAll(skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsletterDto: UpdateNewsletterDto) {
    return this.newsletterService.update(id, updateNewsletterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
