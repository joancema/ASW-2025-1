# Sistema de Votación con GraphQL y NestJS

Este proyecto es un sistema de votación desarrollado con NestJS y GraphQL que permite gestionar ciudadanos, preguntas y respuestas de votación.

## Descripción del Proyecto

El sistema permite:
- Gestionar ciudadanos con cédula y nombre
- Crear preguntas de votación
- Registrar respuestas (votos) de ciudadanos a preguntas específicas
- Consultar toda la información a través de GraphQL

## Arquitectura

- **Framework**: NestJS
- **Base de datos**: SQLite
- **ORM**: TypeORM
- **API**: GraphQL con Apollo Server
- **Validación**: class-validator

## Creación del Proyecto Paso a Paso

### Paso 1: Crear el proyecto base

```bash
# Crear nuevo proyecto NestJS
nest new votaciongraphql

# Navegar al directorio
cd votaciongraphql
```

### Paso 2: Limpiar archivos base

```bash
# Eliminar archivos no necesarios
rm src/app.controller.ts
rm src/app.service.ts
rm src/app.controller.spec.ts
```

Editar `src/app.module.ts` y eliminar las referencias a controller y service:

```typescript
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Paso 3: Desinstalar Prettier (opcional)

```bash
npm uninstall prettier eslint-config-prettier eslint-plugin-prettier
```

### Paso 4: Instalar dependencias de GraphQL

```bash
# Instalar GraphQL y Apollo Server
npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express apollo-server-core
```

### Paso 5: Instalar dependencias de configuración y base de datos

```bash
# Instalar configuración de variables de entorno
npm i @nestjs/config

# Instalar TypeORM y SQLite
npm install --save @nestjs/typeorm typeorm sqlite3

# Instalar validadores
npm i class-validator class-transformer
```

### Paso 6: Configurar GraphQL en el módulo principal

Editar `src/app.module.ts`:

```typescript
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Paso 7: Configurar validación global

Editar `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(3000);
}
bootstrap();
```

### Paso 8: Crear el módulo Ciudadanos

```bash
# Generar recurso ciudadanos
nest g res ciudadanos --no-spec
```

Cuando pregunte el tipo de API, seleccionar **GraphQL (code first)**.

### Paso 9: Definir la entidad Ciudadano

Editar `src/ciudadanos/entities/ciudadano.entity.ts`:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Respuesta } from 'src/respuestas/entities/respuesta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'ciudadanos'})
export class Ciudadano {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  cedula: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  nombre: string;

  @OneToMany(
    () => Respuesta,
    (respuesta) => respuesta.ciudadano,
    { cascade: true }
  )
  respuestas?: Respuesta[]
}
```

### Paso 10: Definir el DTO de creación de Ciudadano

Editar `src/ciudadanos/dto/create-ciudadano.input.ts`:

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCiudadanoInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  cedula: string;

  @Field(() => String, {nullable: true})
  @IsString()
  nombre: string;
}
```

### Paso 11: Actualizar el DTO de actualización de Ciudadano

Editar `src/ciudadanos/dto/update-ciudadano.input.ts`:

```typescript
import { CreateCiudadanoInput } from './create-ciudadano.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCiudadanoInput extends PartialType(CreateCiudadanoInput) {
  @Field(() => ID)
  id: string;
}
```

### Paso 12: Implementar el servicio de Ciudadanos

Editar `src/ciudadanos/ciudadanos.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCiudadanoInput } from './dto/create-ciudadano.input';
import { UpdateCiudadanoInput } from './dto/update-ciudadano.input';
import { Repository } from 'typeorm';
import { Ciudadano } from './entities/ciudadano.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CiudadanosService {
  constructor(
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
  ) {}

  async create(createCiudadanoInput: CreateCiudadanoInput): Promise<Ciudadano> {
    const newCiudadano = this.ciudadanoRepository.create(createCiudadanoInput);
    return await this.ciudadanoRepository.save(newCiudadano);
  }

  async findAll(): Promise<Ciudadano[]> {
    return this.ciudadanoRepository.find();
  }

  async findOne(id: string): Promise<Ciudadano> {
    const item = await this.ciudadanoRepository.findOneBy({id});
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, updateCiudadanoInput: UpdateCiudadanoInput): Promise<Ciudadano> {
    const item = await this.ciudadanoRepository.preload(updateCiudadanoInput);
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);
    return this.ciudadanoRepository.save(item);
  }

  async remove(id: string): Promise<Ciudadano> {
    const ciudadano = await this.findOne(id);
    await this.ciudadanoRepository.remove(ciudadano);
    return { ...ciudadano, id };
  }
}
```

### Paso 13: Configurar el módulo de Ciudadanos

Editar `src/ciudadanos/ciudadanos.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosResolver } from './ciudadanos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudadano } from './entities/ciudadano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudadano])],
  providers: [CiudadanosResolver, CiudadanosService],
})
export class CiudadanosModule {}
```

### Paso 14: Crear el módulo Preguntas

```bash
# Generar recurso preguntas
nest g res preguntas --no-spec
```

### Paso 15: Definir la entidad Pregunta

Editar `src/preguntas/entities/pregunta.entity.ts`:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Respuesta } from 'src/respuestas/entities/respuesta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'preguntas'})
export class Pregunta {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  texto: string;

  @OneToMany(
    () => Respuesta,
    (respuesta) => respuesta.pregunta,
    { cascade: true }
  )
  respuestas?: Respuesta[]
}
```

### Paso 16: Definir el DTO de creación de Pregunta

Editar `src/preguntas/dto/create-pregunta.input.ts`:

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreatePreguntaInput {

  @Field(() => String, {nullable: true})
  @IsString()
  texto: string;
}
```

### Paso 17: Crear el módulo Respuestas

```bash
# Generar recurso respuestas
nest g res respuestas --no-spec
```

### Paso 18: Definir la entidad Respuesta

Editar `src/respuestas/entities/respuesta.entity.ts`:

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Ciudadano } from 'src/ciudadanos/entities/ciudadano.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'respuestas'})
export class Respuesta {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('boolean', {
    unique: false,
    default: true
  })
  @Field(() => Boolean)
  respuesta: boolean;

  @ManyToOne(
    () => Pregunta,
    (pregunta) => pregunta.respuestas,
    { eager: true }
  )
  @Field(() => Pregunta)
  pregunta?: Pregunta

  @ManyToOne(
    () => Ciudadano,
    (ciudadano) => ciudadano.respuestas,
    { eager: true }
  )
  @Field(() => Ciudadano)
  ciudadano?: Ciudadano
}
```

### Paso 19: Definir el DTO de creación de Respuesta

Editar `src/respuestas/dto/create-respuesta.input.ts`:

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRespuestaInput {

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  respuesta: boolean;

  @Field(() => String, {nullable: true})
  @IsString()
  ciudadanoId: string;

  @Field(() => String, {nullable: true})
  @IsString()
  preguntaId: string;
}
```

### Paso 20: Implementar el servicio de Respuestas

Editar `src/respuestas/respuestas.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { CreateRespuestaInput } from './dto/create-respuesta.input';
import { UpdateRespuestaInput } from './dto/update-respuesta.input';
import { Repository } from 'typeorm';
import { Respuesta } from './entities/respuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestasRepository: Repository<Respuesta>
  ) {}

  async create(createRespuestaInput: CreateRespuestaInput): Promise<Respuesta> {
    const respuesta = await this.respuestasRepository.create({
      ...createRespuestaInput,
      ciudadano: {id: createRespuestaInput.ciudadanoId},
      pregunta: {id: createRespuestaInput.preguntaId}
    });
    
    const { id } = await this.respuestasRepository.save(respuesta);
    return await this.findOne(id);
  }

  async findAll(): Promise<Respuesta[]> {
    return await this.respuestasRepository.find();
  }

  async findOne(id: string) {
    return await this.respuestasRepository.findOne({where: {id}});
  }

  async update(id: string, updateRespuestaInput: UpdateRespuestaInput) {
    const updated = await this.respuestasRepository.preload(updateRespuestaInput);
    return await this.respuestasRepository.save(updated);
  }

  async remove(id: string) {
    const deleted = await this.respuestasRepository.findOneBy({id});
    if (!deleted) {
      throw new Error(`Respuesta #${id} not found`);
    }
    await this.respuestasRepository.delete(id);
    return deleted;
  }
}
```

### Paso 21: Actualizar el módulo principal

Editar `src/app.module.ts` para incluir todos los módulos:

```typescript
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
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
```

## Ejecución del Proyecto

### Instalación de dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run start:dev
```

### Acceder a GraphQL Playground

Abrir en el navegador: `http://localhost:3000/graphql`

## Ejemplos de Queries y Mutations

### Crear un ciudadano

```graphql
mutation {
  createCiudadano(createCiudadanoInput: {
    cedula: "1234567890"
    nombre: "Juan Pérez"
  }) {
    id
    cedula
    nombre
  }
}
```

### Crear una pregunta

```graphql
mutation {
  createPregunta(createPreguntaInput: {
    texto: "¿Está de acuerdo con la propuesta?"
  }) {
    id
    texto
  }
}
```

### Crear una respuesta (voto)

```graphql
mutation {
  createRespuesta(createRespuestaInput: {
    respuesta: true
    ciudadanoId: "uuid-del-ciudadano"
    preguntaId: "uuid-de-la-pregunta"
  }) {
    id
    respuesta
    ciudadano {
      nombre
      cedula
    }
    pregunta {
      texto
    }
  }
}
```

### Consultar todos los ciudadanos

```graphql
query {
  ciudadanos {
    id
    cedula
    nombre
  }
}
```

### Consultar todas las respuestas

```graphql
query {
  respuestas {
    id
    respuesta
    ciudadano {
      nombre
      cedula
    }
    pregunta {
      texto
    }
  }
}
```

## Estructura Final del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── schema.gql (generado automáticamente)
├── ciudadanos/
│   ├── dto/
│   │   ├── create-ciudadano.input.ts
│   │   └── update-ciudadano.input.ts
│   │   
│   │   └── entities/
│   │       └── ciudadano.entity.ts
│   │   
│   │   └── ciudadanos.module.ts
│   │   └── ciudadanos.resolver.ts
│   │   └── ciudadanos.service.ts
│   │   
│   ├── preguntas/
│   │   ├── dto/
│   │   │   ├── create-pregunta.input.ts
│   │   │   └── update-pregunta.input.ts
│   │   │   
│   │   │   └── entities/
│   │   │   └── pregunta.entity.ts
│   │   │   
│   │   │   └── preguntas.module.ts
│   │   │   └── preguntas.resolver.ts
│   │   │   └── preguntas.service.ts
│   │   │   
│   │   └── respuestas/
│   │   │   ├── dto/
│   │   │   │   ├── create-respuesta.input.ts
│   │   │   │   └── update-respuesta.input.ts
│   │   │   │   
│   │   │   │   └── entities/
│   │   │   │   └── respuesta.entity.ts
│   │   │   │   
│   │   │   │   └── respuestas.module.ts
│   │   │   │   └── respuestas.resolver.ts
│   │   │   │   └── respuestas.service.ts
│   │   │   │   
│   │   └── app.module.ts
│   │   └── main.ts
│   │   └── schema.gql
│   └── README.md
```

## Scripts disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Build
npm run build

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

## Tecnologías utilizadas

- **NestJS**: Framework de Node.js
- **GraphQL**: API Query Language
- **Apollo Server**: Servidor GraphQL
- **TypeORM**: ORM para TypeScript
- **SQLite**: Base de datos
- **class-validator**: Validación de datos
- **class-transformer**: Transformación de objetos

## Notas adicionales

- El esquema GraphQL se genera automáticamente en `src/schema.gql`
- La base de datos SQLite se crea automáticamente como `database.sqlite`
- Las validaciones se aplican automáticamente en todos los inputs
- Las relaciones entre entidades se manejan con TypeORM y se exponen en GraphQL
