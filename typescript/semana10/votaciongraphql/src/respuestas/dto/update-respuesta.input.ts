import { IsUUID } from 'class-validator';
import { CreateRespuestaInput } from './create-respuesta.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateRespuestaInput extends PartialType(CreateRespuestaInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;
}
