import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CiudadanosService } from './ciudadanos.service';
import { Ciudadano } from './entities/ciudadano.entity';
import { CreateCiudadanoInput } from './dto/create-ciudadano.input';
import { UpdateCiudadanoInput } from './dto/update-ciudadano.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Ciudadano)
export class CiudadanosResolver {
  constructor(private readonly ciudadanosService: CiudadanosService) {}

  @Mutation(() => Ciudadano)
  async createCiudadano(@Args('createCiudadanoInput') createCiudadanoInput: CreateCiudadanoInput)
  : Promise<Ciudadano> {
    return this.ciudadanosService.create(createCiudadanoInput);
  }

  @Query(() => [Ciudadano], { name: 'ciudadanos' })
  async findAll():Promise<Ciudadano[]> {
    return this.ciudadanosService.findAll();
  }

  @Query(() => Ciudadano, { name: 'ciudadano' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string): Promise<Ciudadano> {
    return this.ciudadanosService.findOne(id);
  }

  @Mutation(() => Ciudadano)
  updateCiudadano(@Args('updateCiudadanoInput') updateCiudadanoInput: UpdateCiudadanoInput)
  : Promise<Ciudadano> {
    return this.ciudadanosService.update(updateCiudadanoInput.id, updateCiudadanoInput);
  }

  @Mutation(() => Ciudadano)
  removeCiudadano(@Args('id', { type: () => ID }) id: string):Promise<Ciudadano> {
    return this.ciudadanosService.remove(id);
  }
}
