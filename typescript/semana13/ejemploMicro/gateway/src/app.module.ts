import { Module } from '@nestjs/common';
import { CiudadanosModule } from './ciudadanos/ciudadanos.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [CiudadanosModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
