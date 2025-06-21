import { Injectable } from '@nestjs/common';
import { CreatePreguntaInput } from './dto/create-pregunta.input';
import { UpdatePreguntaInput } from './dto/update-pregunta.input';
import { Pregunta } from './entities/pregunta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PreguntasService {
  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>
  ) {}
  async create(createPreguntaInput: CreatePreguntaInput):Promise<Pregunta> {
    const created =  this.preguntaRepository.create(createPreguntaInput);
    return await this.preguntaRepository.save(created);
  }

  async findAll(): Promise<Pregunta[]>{
    return await this.preguntaRepository.find();
  }

  async findOne(id: string): Promise<Pregunta> {
    return await this.preguntaRepository.findOne({where: {id}});
  }

  async update(id: string, updatePreguntaInput: UpdatePreguntaInput): Promise<Pregunta> {
    const updated = await this.preguntaRepository.preload(updatePreguntaInput)
    if (!updated) throw new Error(`Pregunta with id: ${id} not found`);
    return await this.preguntaRepository.save(updated);
  }

  async remove(id: string): Promise<Pregunta> {
    const pregunta = await this.findOne(id);
    if (!pregunta) throw new Error(`Pregunta with id: ${id} not found`);
    return await this.preguntaRepository.remove(pregunta);
  }
}
