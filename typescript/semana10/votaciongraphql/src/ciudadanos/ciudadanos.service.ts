import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCiudadanoInput } from './dto/create-ciudadano.input';
import { UpdateCiudadanoInput } from './dto/update-ciudadano.input';
import { Repository } from 'typeorm';
import { Ciudadano } from './entities/ciudadano.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CiudadanosService {
  constructor(
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano> ,
  ) {}
  async create(createCiudadanoInput: CreateCiudadanoInput): Promise<Ciudadano> {
    const newCiudadano = this.ciudadanoRepository.create(createCiudadanoInput);
    return await this.ciudadanoRepository.save(newCiudadano);
  }

  async findAll(): Promise<Ciudadano[]> {
    return this.ciudadanoRepository.find();
  }

  async findOne(id: string): Promise<Ciudadano> {
    const item = await this.ciudadanoRepository.findOneBy({id});
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  
  
  async update(id: string, updateCiudadanoInput: UpdateCiudadanoInput): Promise<Ciudadano> {
    
    const item = await this.ciudadanoRepository.preload(updateCiudadanoInput);

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return this.ciudadanoRepository.save( item );

  }

  async remove( id: string ):Promise<Ciudadano> {
    const ciudadano = await this.findOne( id );
    await this.ciudadanoRepository.remove( ciudadano );
    return { ...ciudadano, id };
  }
}
