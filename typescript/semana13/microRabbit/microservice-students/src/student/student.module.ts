import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentSchema } from './schema/student.schema';
import { STUDENT } from 'src/common/models/models';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: STUDENT.name,
        useFactory: () => StudentSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
