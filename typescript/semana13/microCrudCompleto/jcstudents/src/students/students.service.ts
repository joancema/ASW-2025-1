import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}
  create(createStudentDto: CreateStudentDto) {
    return this.studentsRepository.save(createStudentDto);
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;

    const totalPages= await  this.studentsRepository.count({ where: { isActive: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.studentsRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          isActive: true,
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };

    
  }


  async findOne(id: number) {
    const student = this.studentsRepository.findOne({where: {id}});

    if (!student) {
      throw new RpcException({
        message: `Student with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return student;
    
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const { id: __, ...data } = updateStudentDto;
    const student=await this.findOne(id);
    if (!student) {
      return null;
    }
    const studentUpdated= await this.studentsRepository.save({
      id,
      ...data,
    });
    return {...student, ...studentUpdated};
    // const updated= await this.usersRepository.update(id, data);
    // return { id, ...data };

  }

  async remove(id: number) {
    const student =await this.findOne(id);
    if (!student) {
      return null
    }
    const studentUpdated = await this.studentsRepository.save({
       id,
       isActive: false,
    });

    return studentUpdated;
  }
}
