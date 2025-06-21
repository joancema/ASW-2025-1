import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { join } from 'path';
import { CiudadanosModule } from './ciudadanos/ciudadanos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasModule } from './preguntas/preguntas.module';
import { RespuestasModule } from './respuestas/respuestas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ],
      
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      autoLoadEntities: true
    }),
    CiudadanosModule,
    PreguntasModule,
    RespuestasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
