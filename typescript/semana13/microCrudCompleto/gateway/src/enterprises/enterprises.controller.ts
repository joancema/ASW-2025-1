import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('enterprises')
export class EnterprisesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.client.send(
      { cmd: 'create_enterprise' },
      createEnterpriseDto,
    );
  }

  @Get()
  async findAll(@Body() paginationDto: PaginationDto) {
    try{
      const enterprises= await firstValueFrom(this.client.send({cmd:'find_all_enterprises'},paginationDto));
      return enterprises;
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return  this.client.send({ cmd: 'find_one_enterprise' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number
  , @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.client
      .send(
        { cmd: 'update_enterprise' },
        {
          id,
          ...updateEnterpriseDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'remove_enterprise' },{ id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    )
  }
}
