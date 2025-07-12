import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { CreateEntityTypeDto } from './dto/create-entity-type.dto';
import { UpdateEntityTypeDto } from './dto/update-entity-type.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('entity-types')
export class EntityTypesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createEntityTypeDto: CreateEntityTypeDto) {
    return this.client.send(
      { cmd: 'create_entitytype' },
      createEntityTypeDto,
    );
  }

  @Get()
  async findAll(@Body() paginationDto: PaginationDto) {
    try{
      const entities= await firstValueFrom(this.client.send({cmd:'find_all_entitytypes'},paginationDto));
      return entities;
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return  this.client.send({ cmd: 'find_one_entitytype' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEntityTypeDto: UpdateEntityTypeDto) {
    return this.client
      .send(
        { cmd: 'update_entitytype' },
        {
          id,
          ...updateEntityTypeDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'remove_entitytype' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    )
  }
}
