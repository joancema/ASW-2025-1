import { Module } from '@nestjs/common';
import { CiudadanosController } from './ciudadanos.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [CiudadanosController],
  imports: [NatsModule],
  providers: [],
})
export class CiudadanosModule {}
