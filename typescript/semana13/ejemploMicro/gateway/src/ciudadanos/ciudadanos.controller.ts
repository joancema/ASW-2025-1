import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Controller('ciudadanos')
export class CiudadanosController {
  constructor(
    @Inject( NATS_SERVICE ) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createCiudadanoDto: CreateCiudadanoDto) {
  }

  @Get()
  async findAll() {
    // return this.client.send({ cmd: 'get-ciudadanos' }, {}).toPromise()

    // try {
    //   const ciudadanos= await firstValueFrom(this.client.send({ cmd: 'get-ciudadanos' }, {}))
    //   return ciudadanos
    // }
    // catch (error) {
    //   throw new RpcException(error);
    // }
    
    return this.client.send({ cmd: 'get-ciudadanos' }, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      })
    );

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadanoDto: UpdateCiudadanoDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
