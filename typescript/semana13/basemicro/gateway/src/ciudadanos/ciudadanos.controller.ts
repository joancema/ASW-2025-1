import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('ciudadanos')
export class CiudadanosController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createCiudadanoDto: CreateCiudadanoDto) {
    // return this.ciudadanosService.create(createCiudadanoDto);
  }

  @Get()
  async findAll() {
    // return this.client.send('ciudadanos', {});try{
    //   const entities= await firstValueFrom(this.client.send({cmd:'find_all_ciudadanos'},{}));
    //   return entities;
    //   } catch (error) {
    //     throw new RpcException(error);
    //   }
    return this.client.send({ cmd: 'find_all_ciudadanos' },{  }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.ciudadanosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadanoDto: UpdateCiudadanoDto) {
    // return this.ciudadanosService.update(+id, updateCiudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.ciudadanosService.remove(+id);
  }
}
