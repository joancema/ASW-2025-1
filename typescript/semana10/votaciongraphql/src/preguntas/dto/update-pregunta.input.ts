import { IsUUID } from 'class-validator';
import { CreatePreguntaInput } from './create-pregunta.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePreguntaInput extends PartialType(CreatePreguntaInput) {

  @Field(() => ID)
  @IsUUID()
  id: string;
}
