import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { LocalFileStorageService } from '../common/services/storage/local-file-storage.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: IFileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule { }
