import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PreguntasService } from './preguntas.service';
import { Pregunta } from './entities/pregunta.entity';
import { CreatePreguntaInput } from './dto/create-pregunta.input';
import { UpdatePreguntaInput } from './dto/update-pregunta.input';

@Resolver(() => Pregunta)
export class PreguntasResolver {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Mutation(() => Pregunta)
  createPregunta(@Args('createPreguntaInput') createPreguntaInput: CreatePreguntaInput) {
    return this.preguntasService.create(createPreguntaInput);
  }

  @Query(() => [Pregunta], { name: 'preguntas' })
  findAll() {
    return this.preguntasService.findAll();
  }

  @Query(() => Pregunta, { name: 'pregunta' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.preguntasService.findOne(id);
  }

  @Mutation(() => Pregunta)
  updatePregunta(@Args('updatePreguntaInput') updatePreguntaInput: UpdatePreguntaInput) {
    return this.preguntasService.update(updatePreguntaInput.id, updatePreguntaInput);
  }

  @Mutation(() => Pregunta)
  removePregunta(@Args('id', { type: () => String }) id: string) {
    return this.preguntasService.remove(id);
  }
}
