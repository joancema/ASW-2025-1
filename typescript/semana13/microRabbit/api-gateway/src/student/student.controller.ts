import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StudentMSG } from './../common/constants';
import { Observable } from 'rxjs';
import { StudentDTO } from './dto/student.dto';
import { ClientProxySuperFlights } from './../common/proxy/client-proxy';
import { IStudent } from 'src/common/interfaces/student.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('students')
// @UseGuards(JwtAuthGuard)
@Controller('api/v2/student')
export class StudentController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyStudent = this.clientProxy.clientProxyStudents();

  @Post()
  create(@Body() studentDTO: StudentDTO): Observable<IStudent> {
    return this._clientProxyStudent.send(StudentMSG.CREATE, studentDTO);
  }

  @Get()
  findAll(): Observable<IStudent[]> {
    return this._clientProxyStudent.send(StudentMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IStudent> {
    return this._clientProxyStudent.send(StudentMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() studentDTO: StudentDTO): Observable<IStudent> {
    return this._clientProxyStudent.send(StudentMSG.UPDATE, { id, studentDTO });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyStudent.send(StudentMSG.DELETE, id);
  }
}
