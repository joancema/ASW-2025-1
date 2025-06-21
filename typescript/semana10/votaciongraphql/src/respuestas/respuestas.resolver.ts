import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RespuestasService } from './respuestas.service';
import { Respuesta } from './entities/respuesta.entity';
import { CreateRespuestaInput } from './dto/create-respuesta.input';
import { UpdateRespuestaInput } from './dto/update-respuesta.input';

@Resolver(() => Respuesta)
export class RespuestasResolver {
  constructor(private readonly respuestasService: RespuestasService) {}

  @Mutation(() => Respuesta)
  createRespuesta(@Args('createRespuestaInput') createRespuestaInput: CreateRespuestaInput): Promise<Respuesta>{
    return this.respuestasService.create(createRespuestaInput);
  }

  @Query(() => [Respuesta], { name: 'respuestas' })
  findAll(): Promise<Respuesta[]>{
    return this.respuestasService.findAll();
  }

  @Query(() => Respuesta, { name: 'respuesta' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Respuesta> {
    return this.respuestasService.findOne(id);
  }

  @Mutation(() => Respuesta)
  updateRespuesta(@Args('updateRespuestaInput') updateRespuestaInput: UpdateRespuestaInput)
   : Promise<Respuesta> {
    return this.respuestasService.update(updateRespuestaInput.id, updateRespuestaInput);
  }

  @Mutation(() => Respuesta)
  removeRespuesta(@Args('id', { type: () => String }) id: string): Promise<Respuesta> {
    return this.respuestasService.remove(id);
  }
}
