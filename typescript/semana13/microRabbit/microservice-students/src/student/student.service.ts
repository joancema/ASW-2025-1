import { StudentDTO } from './dto/student.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { STUDENT } from 'src/common/models/models';
import { IStudent } from 'src/common/interfaces/student.interface';

@Injectable()
export class StudentService {
  constructor(@InjectModel(STUDENT.name) private readonly model: Model<IStudent>) {}

  
  async create(studentDTO: StudentDTO): Promise<IStudent> {
    const newStudent = new this.model(studentDTO);
    return await newStudent.save();
  }

  async findAll(): Promise<IStudent[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<IStudent> {
    return await this.model.findById(id);
  }

  async update(id: string, studentDTO: StudentDTO): Promise<IStudent> {
    return await this.model.findByIdAndUpdate(id, studentDTO , { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
