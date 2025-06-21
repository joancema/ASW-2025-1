import { Injectable } from '@nestjs/common';
import { CreateRespuestaInput } from './dto/create-respuesta.input';
import { UpdateRespuestaInput } from './dto/update-respuesta.input';
import { Repository } from 'typeorm';
import { Respuesta } from './entities/respuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestasRepository: Repository<Respuesta>
  ) {}
  async create(createRespuestaInput: CreateRespuestaInput): Promise<Respuesta> {
    const respuesta = await  this.respuestasRepository.create(
      {...createRespuestaInput,
        ciudadano: {id: createRespuestaInput.ciudadanoId},
        pregunta: {id: createRespuestaInput.preguntaId}
      });
    // await  this.respuestasRepository.save(respuesta);
    // return respuesta;
    const { id  } = await this.respuestasRepository.save(respuesta);
    return await this.findOne(id);
  }

  async findAll(): Promise<Respuesta[]> {
    return await this.respuestasRepository.find();
  }

  async findOne(id: string) {
    return await this.respuestasRepository.findOne({where:{id}});
  }

  async update(id: string, updateRespuestaInput: UpdateRespuestaInput) {
    const updated =  await this.respuestasRepository.preload(updateRespuestaInput);
    return await this.respuestasRepository.save(updated);
  }

  async remove(id: string) {
    const deleted = await this.respuestasRepository.findOneBy({id});
    if (!deleted) {
      throw new Error(`Respuesta #${id} not found`);
    }
    await this.respuestasRepository.delete(id);
    return deleted;

  }
}
