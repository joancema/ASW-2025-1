import { IsUUID } from 'class-validator';
import { CreateCiudadanoInput } from './create-ciudadano.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCiudadanoInput extends PartialType(CreateCiudadanoInput) {

  @Field(() => ID)
  @IsUUID()
  id: string;
}
