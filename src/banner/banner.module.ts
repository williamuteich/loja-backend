import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { LocalFileStorageService } from '../common/services/storage/local-file-storage.service';

@Module({
  controllers: [BannerController],
  providers: [
    BannerService,
    {
      provide: IFileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
})
export class BannerModule {}
