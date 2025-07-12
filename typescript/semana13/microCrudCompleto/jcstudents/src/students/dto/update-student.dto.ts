import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsNumber()
  @IsPositive()
  id: number;

}
