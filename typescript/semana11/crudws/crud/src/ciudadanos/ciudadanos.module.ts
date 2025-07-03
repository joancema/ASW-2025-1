import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosGateway } from './ciudadanos.gateway';

@Module({
  providers: [CiudadanosGateway, CiudadanosService],
})
export class CiudadanosModule {}
