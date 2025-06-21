import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRespuestaInput {
  

  @Field(()=>Boolean)
  @IsNotEmpty()
  @IsBoolean()
  respuesta:boolean;

  @Field(()=>String, {nullable:true})
  @IsString()
  ciudadanoId:string;


  @Field(()=>String, {nullable:true})
  @IsString()
  preguntaId:string;

}
