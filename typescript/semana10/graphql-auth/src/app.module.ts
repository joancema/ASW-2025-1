import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ],
      introspection: true,
      csrfPrevention: false, // Desactivar protección CSRF para desarrollo
      context: ({ req }) => ({ req }),
    }),
    // Configuración de TypeORM con SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    // Módulos de la aplicación
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
