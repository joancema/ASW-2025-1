import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Ciudadano } from 'src/ciudadanos/entities/ciudadano.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'respuestas'})
export class Respuesta {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id:string;

  @Column('boolean', {
    unique: false,
    default: true
  })
  @Field( () => Boolean )
  respuesta: boolean;

  @ManyToOne(
    () => Pregunta,
    ( pregunta ) => pregunta.respuestas,
    { eager: true }
  )
  @Field( () => Pregunta )
  pregunta?: Pregunta

@ManyToOne(
    () => Ciudadano,
    ( ciudadano ) => ciudadano.respuestas,
    { eager: true }
)
@Field( () => Ciudadano )
ciudadano?: Ciudadano

}
