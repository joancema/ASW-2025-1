import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { StudentController } from './student.controller';

@Module({
  imports: [ProxyModule],
  controllers: [StudentController],
})
export class StudentModule {}
