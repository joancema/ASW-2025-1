import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasResolver } from './respuestas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuesta } from './entities/respuesta.entity';

@Module({
  providers: [RespuestasResolver, RespuestasService],
  imports: [ TypeOrmModule.forFeature([Respuesta]) ],
  exports: [ TypeOrmModule ]
})
export class RespuestasModule {}
