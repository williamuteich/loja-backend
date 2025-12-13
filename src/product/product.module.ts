import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { LocalFileStorageService } from '../common/services/storage/local-file-storage.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: IFileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
})
export class ProductModule {}
