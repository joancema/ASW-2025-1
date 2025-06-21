import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasResolver } from './preguntas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './entities/pregunta.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Pregunta]) ],
  exports: [ TypeOrmModule ],
  providers: [PreguntasResolver, PreguntasService],

})
export class PreguntasModule {}
