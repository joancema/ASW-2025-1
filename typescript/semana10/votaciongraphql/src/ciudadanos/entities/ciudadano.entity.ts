import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Respuesta } from 'src/respuestas/entities/respuesta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'ciudadanos'})
export class Ciudadano {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id:string;

  @Column()
  @Field( ()=>  String )
  cedula:string;

  @Column({nullable: true})
  @Field( () => String, {nullable: true} )
  nombre:string;

  @OneToMany(
    () => Respuesta,
    ( respuesta ) => respuesta.ciudadano,
    { cascade:true }
)
respuestas?: Respuesta[]
  
}
