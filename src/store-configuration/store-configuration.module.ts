import { Module } from '@nestjs/common';
import { StoreConfigurationService } from './store-configuration.service';
import { StoreConfigurationController } from './store-configuration.controller';
import { IFileStorageService } from '../common/interfaces/IFileStorageService';
import { LocalFileStorageService } from '../common/services/storage/local-file-storage.service';

@Module({
  controllers: [StoreConfigurationController],
  providers: [
    StoreConfigurationService,
    {
      provide: IFileStorageService,
      useClass: LocalFileStorageService,
    },
  ],
})
export class StoreConfigurationModule {}
