import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BcryptHashService } from '../common/services/hash/bcrypt-hash.service';
import { IHashService } from '../common/interfaces/IHashService';

@Module({
    controllers: [ClientController],
    providers: [
        ClientService,
        {
            provide: IHashService,
            useClass: BcryptHashService,
        },
    ],
    exports: [ClientService]
})
export class ClientModule { }
