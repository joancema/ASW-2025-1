import { Module } from '@nestjs/common';
import { PruebaService } from './prueba.service';
import { PruebaGateway } from './prueba.gateway';

@Module({
  providers: [PruebaGateway, PruebaService],
})
export class PruebaModule {}
