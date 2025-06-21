import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCiudadanoInput {

  @Field(()=>String)
  @IsNotEmpty()
  @IsString()
  cedula:string;

  @Field(()=>String, {nullable:true})
  @IsString()
  nombre:string;

}
