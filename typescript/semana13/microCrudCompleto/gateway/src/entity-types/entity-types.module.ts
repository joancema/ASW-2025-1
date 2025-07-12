import { Module } from '@nestjs/common';
import { EntityTypesController } from './entity-types.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EntityTypesController],
  imports: [NatsModule],
})
export class EntityTypesModule {}
