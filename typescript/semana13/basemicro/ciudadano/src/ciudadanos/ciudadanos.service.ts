import { Injectable } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';


const ciudadanos = [
  {
    id: 1,
    nombre: 'Juan',
    email: 'prueba@hotmail.com'
  }, 
  {
    id: 2,
    nombre: 'Pedro',
    email: 'pedro@hot.com'
  }
  ]

@Injectable()
export class CiudadanosService {
  create(createCiudadanoDto: CreateCiudadanoDto) {
    return 'This action adds a new ciudadano';
  }

  findAll() {
    return ciudadanos;
  }

  findOne(id: number) {
    return `This action returns a #${id} ciudadano`;
  }

  update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    return `This action updates a #${id} ciudadano`;
  }

  remove(id: number) {
    return `This action removes a #${id} ciudadano`;
  }
}
