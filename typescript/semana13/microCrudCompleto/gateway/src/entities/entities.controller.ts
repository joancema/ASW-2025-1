import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('entities')
export class EntitiesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy,) {}

  @Post()
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.client.send(
      { cmd: 'create_entity' },
      createEntityDto,
    );
  }

  @Get()
  async findAll(@Body() paginationDto: PaginationDto) {
    try{
      const entities= await firstValueFrom(this.client.send({cmd:'find_all_entities'},paginationDto));
      return entities;
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return  this.client.send({ cmd: 'find_one_entity' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number,
   @Body() updateEntityDto: UpdateEntityDto) {
    return this.client
      .send(
        { cmd: 'update_entity' },
        {
          id,
          ...updateEntityDto,
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
    return this.client.send({ cmd: 'remove_entity' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    )
  }
}
