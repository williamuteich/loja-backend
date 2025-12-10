import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @Get()
    findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
        return this.clientService.findAll(
            skip ? parseInt(skip) : 0,
            take ? parseInt(take) : 10,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientService.update(id, updateClientDto);
    }
}
