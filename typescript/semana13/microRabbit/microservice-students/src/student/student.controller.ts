import { StudentService } from './student.service';
import { StudentDTO } from './dto/student.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentMsg } from 'src/common/constants';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern(StudentMsg.CREATE)
  create(@Payload() studentDTO: StudentDTO) {
    return this.studentService.create(studentDTO);
  }

  @MessagePattern(StudentMsg.FIND_ALL)
  findAll() {
    return this.studentService.findAll();
  }

  @MessagePattern(StudentMsg.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.studentService.findOne(id);
  }
  @MessagePattern(StudentMsg.UPDATE)
  update(@Payload() payload: any) {
    return this.studentService.update(payload.id, payload.studentDTO);
  }

  @MessagePattern(StudentMsg.DELETE)
  delete(@Payload() id: string) {
    return this.studentService.delete(id);
  }
}
