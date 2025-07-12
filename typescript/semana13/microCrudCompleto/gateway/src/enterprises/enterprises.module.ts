import { Module } from '@nestjs/common';
import { EnterprisesController } from './enterprises.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EnterprisesController],
  imports: [NatsModule],
})
export class EnterprisesModule {}
