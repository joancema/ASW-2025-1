import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [StudentsController],
  providers: [],
  imports: [NatsModule],
})
export class StudentsModule {}
