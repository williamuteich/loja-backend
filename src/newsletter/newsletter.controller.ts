import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Inject } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CacheKey, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createNewsletterDto: CreateNewsletterDto) {
    const result = await this.newsletterService.create(createNewsletterDto);
    await this.cacheManager.del('newsletters_all');
    return result;
  }

  @Get()
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('newsletters_all')
  @CacheTTL(3600000)
  findAll(@Query() query: PaginationQueryDto) {
    const { skip = 0, take = 10 } = query;
    return this.newsletterService.findAll(skip, take);
  }

  @Get(':id')
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheTTL(3600000)
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNewsletterDto: UpdateNewsletterDto) {
    const result = await this.newsletterService.update(id, updateNewsletterDto);
    await this.cacheManager.del('newsletters_all');
    await this.cacheManager.del(`/newsletter/${id}`);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.newsletterService.remove(id);
    await this.cacheManager.del('newsletters_all');
    await this.cacheManager.del(`/newsletter/${id}`);
    return result;
  }
}
