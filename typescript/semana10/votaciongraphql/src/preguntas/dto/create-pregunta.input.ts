import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePreguntaInput {

   
  @Field(()=>String, {nullable:true})
  @IsString()
  texto:string;
}
