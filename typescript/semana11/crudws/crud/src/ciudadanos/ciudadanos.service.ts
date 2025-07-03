import { Injectable } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

const ciudadanos = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    edad: 30,
    fechaNacimiento: '1991-01-01',
    direccion: 'Calle 1',
    telefono: '12345678',
    email: ''
  },
  {
    id: 2,
    nombre: 'Maria',
    apellido: 'Lopez',
    edad: 25,
    fechaNacimiento: '1996-01-01',
    direccion: 'Calle 2',
    telefono: '87654321',
    email: ''
  }
]

@Injectable()
export class CiudadanosService {
  create(createCiudadanoDto: CreateCiudadanoDto) {
    ciudadanos.push(createCiudadanoDto);
    return createCiudadanoDto;
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
