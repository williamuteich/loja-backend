import { Controller, Get, Post, Body, Patch, Param, Query, Request, ForbiddenException } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('client')
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    @Auth(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new client (ADMIN only)' })
    @ApiResponse({ status: 201, description: 'The client has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @Get()
    @Auth(Role.ADMIN, Role.COLLABORATOR)
    @ApiOperation({ summary: 'Get all clients (ADMIN/COLLABORATOR only)' })
    @ApiResponse({ status: 200, description: 'Return all clients.' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' })
    @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take' })
    findAll(@Query() query: PaginationQueryDto) {
        const { skip = 0, take = 10 } = query;
        return this.clientService.findAll(skip, take);
    }

    @Get(':id')
    @Auth(Role.ADMIN, Role.COLLABORATOR, Role.CLIENT)
    @ApiOperation({ summary: 'Get a client by ID (team members or own data)' })
    @ApiResponse({ status: 200, description: 'Return the client.' })
    @ApiResponse({ status: 404, description: 'Client not found.' })
    @ApiParam({ name: 'id', description: 'Client ID' })
    findOne(@Param('id') id: string, @Request() req) {
        if (req.user.role === Role.CLIENT && req.user.id !== id) {
            throw new ForbiddenException('You can only view your own data');
        }
        return this.clientService.findOne(id);
    }

    @Patch(':id')
    @Auth(Role.ADMIN, Role.CLIENT)
    @ApiOperation({ summary: 'Update a client (own data or ADMIN)' })
    @ApiResponse({ status: 200, description: 'The client has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Client not found.' })
    @ApiParam({ name: 'id', description: 'Client ID' })
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req) {
        if (req.user.role !== Role.ADMIN && req.user.id !== id) {
            throw new ForbiddenException('You can only update your own data');
        }
        return this.clientService.update(id, updateClientDto);
    }
}
