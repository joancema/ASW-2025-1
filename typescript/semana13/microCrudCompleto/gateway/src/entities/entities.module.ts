import { Module } from '@nestjs/common';
import { EntitiesController } from './entities.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EntitiesController],
  imports: [NatsModule],
})
export class EntitiesModule {}
