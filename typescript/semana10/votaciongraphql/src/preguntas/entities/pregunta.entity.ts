import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Respuesta } from 'src/respuestas/entities/respuesta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'preguntas'})
export class Pregunta {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id:string;

  
  @Column({nullable: true})
  @Field( () => String, {nullable: true} )
  texto:string;

  @OneToMany(
    () => Respuesta,
    ( respuesta ) => respuesta.pregunta,
    { cascade:true }
)
respuestas?: Respuesta[]
  
}
