<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## paso 1
nest new votaciongraphql
## paso 2 eliminar controller, service y en el app.module.ts eliminar referencias
## paso 3 desinstalar prettier
npm uninstall prettier eslint-config-prettier eslint-plugin-prettier
## paso 4 instalaciones pero primero revisar web de nest
 npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
## paso 5
npm i apollo-server-core
## paso6 configuar plugin de apollo como sandbox en app.module.ts

```
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ],
    })
```

## paso 7 instalar recurso ciudadanos y probar localhost:3000/graphql
nest g res ciudadanos --no-spec
## paso8 cambiar service y probar localhost:3000/graphql
findAll() {
    return [];
  }
## paso 9 definir archivo.dev con el siguiente contenido
DB_PASSWORD=MysecretPassword
DB_NAME=clases
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
## paso 10 instalar config para variables de sesion
npm i @nestjs/config
## paso 11 agregar al app.module el siguiente import
ConfigModule.forRoot(),
## paso 12 instalar typeorm dependences
npm install --save @nestjs/typeorm typeorm pg
## paso 13 agregar en app.module.ts el siguiente import

```
TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT ,
      username: process.env.DB_USERNAME, 
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_NAME ,
      synchronize: true,
      autoLoadEntities: true
    }),
```
#ademas recordar que primero va el ConfigModule y luego TypeOrmModule

## paso 14 empezar por el Entity de ciudadano y darse cuenta que pertenece a Typeorm y que a graph
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'ciudadanos'})
export class Ciudadano {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id:string;

  @Column()
  @Field( ()=>  String )
  cedula:string;

  @Column( )
  @Field( () => String )
  nombre:string;
}
## paso 15 Definir DTO create-ciudadano.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCiudadanoInput {

  @Field(()=>String)
  cedula:string;

  @Field(()=>String, {nullable:true})
  nombre:string;

}
## paso 16 instalar class-validator
npm i class-validator class-transformer
---- main.ts ---
app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
    })
  )
## paso 17 aplicar validaciones en dto
@Field(()=>String)
  @IsNotEmpty()
  @IsString()
  cedula:string;

  @Field(()=>String, {nullable:true})
  @IsString()
  nombre:string;
## paso 18 actualizar el update-ciudadano.input.ts

```
@Field(() => ID)
  id: string;
```

## paso 19 
## paso 20 
