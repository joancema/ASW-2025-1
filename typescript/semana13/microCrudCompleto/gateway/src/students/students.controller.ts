import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('students')
export class StudentsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards( AuthGuard )
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.client.send(
      { cmd: 'create_student' },
      createStudentDto,
    );
  }

  // @UseGuards( AuthGuard )
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try{
    const students= await firstValueFrom(this.client.send(
      {cmd:'find_all_students'},
      paginationDto,
    ));
    return students;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const student = await firstValueFrom(
        this.client.send({ cmd: 'find_one_student' },{ id })
      );
      return student;

    } catch (error) {
      throw new RpcException(error);
    }
  
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  patchStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.client
      .send(
        { cmd: 'update_student' },
        {
          id,
          ...updateStudentDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_student' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
