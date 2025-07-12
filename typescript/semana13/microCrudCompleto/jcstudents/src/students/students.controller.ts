import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @MessagePattern({cmd:'create_student'})
  create(@Payload() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @MessagePattern({cmd:'find_all_students'})
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  @MessagePattern({cmd:'find_one_student'})
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @MessagePattern({cmd:'update_student'})
  update(@Payload() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(updateStudentDto.id, updateStudentDto);
  }

  @MessagePattern({cmd:'delete_student'})
  remove(@Payload('id', ParseIntPipe ) id: number) {
    return this.studentsService.remove(id);
  }
}
