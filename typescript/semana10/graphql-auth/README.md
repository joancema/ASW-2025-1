<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# GraphQL Auth Project

Proyecto NestJS con GraphQL, autenticación JWT y TypeORM usando SQLite.

## Características

- ✅ **GraphQL** con Apollo Server
- ✅ **Autenticación JWT** con Passport
- ✅ **TypeORM** con SQLite
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Validación** con class-validator
- ✅ **Decorador @CurrentUser()** personalizado
- ✅ **Guards** para proteger resolvers
- ✅ **Apollo Studio Landing Page** con interfaz moderna
- ✅ **CSRF Protection** desactivada para desarrollo

## Estructura del Proyecto

```
src/
├── auth/
│   ├── auth.module.ts          # Módulo de autenticación
│   ├── auth.service.ts         # Lógica de negocio para auth
│   ├── auth.resolver.ts        # Resolvers GraphQL para auth
│   ├── auth.guard.ts           # Guard JWT para GraphQL
│   └── jwt.strategy.ts         # Estrategia JWT de Passport
├── common/
│   └── decorators/
│       └── current-user.decorator.ts  # Decorador @CurrentUser()
├── user/
│   ├── user.entity.ts          # Entidad User con TypeORM
│   ├── user.module.ts          # Módulo de usuario
│   ├── user.service.ts         # Servicio de usuario
│   └── user.resolver.ts        # Resolver de usuario
├── app.module.ts               # Módulo principal
└── main.ts                     # Punto de entrada
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev
```

## GraphQL Interface

Una vez iniciado el servidor, puedes acceder a Apollo Studio en:
http://localhost:3000/graphql

El proyecto utiliza:
- `ApolloServerPluginLandingPageLocalDefault()` - Interfaz moderna de Apollo Studio
- `playground: false` - Playground clásico desactivado
- `introspection: true` - Introspección habilitada
- `csrfPrevention: false` - Protección CSRF desactivada para desarrollo

## Configuración de Producción

⚠️ **Importante**: Para producción, debes:

1. **Configurar para producción:**
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  // ... otras configuraciones
  playground: false,
  plugins: [], // Remover plugins de desarrollo
  csrfPrevention: true,
})
```

2. **Usar variables de entorno:**
```env
JWT_SECRET=your-very-secure-secret-key
NODE_ENV=production
```

## Operaciones GraphQL

### 1. Registro de Usuario

```graphql
mutation {
  register(input: {
    username: "john_doe"
    email: "john@example.com"
    password: "password123"
  }) {
    user {
      id
      username
      email
    }
    token
  }
}
```

### 2. Login de Usuario

```graphql
mutation {
  login(input: {
    username: "john_doe"
    password: "password123"
  }) {
    user {
      id
      username
      email
    }
    token
  }
}
```

### 3. Obtener Perfil (Protegido)

```graphql
query {
  me {
    id
    username
    email
  }
}
```

**Headers necesarios para queries protegidas:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

## Seguridad

- Las contraseñas se hashean automáticamente con bcrypt antes de guardar
- Los tokens JWT expiran en 24 horas
- Los resolvers protegidos requieren autenticación válida
- Validación de entrada con class-validator

## Base de Datos

El proyecto usa SQLite con un archivo `database.sqlite` que se crea automáticamente.
La opción `synchronize: true` está habilitada solo para desarrollo.

## Variables de Entorno (Recomendado para Producción)

```env
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=24h
DATABASE_URL=your-database-url
PORT=3000
```

## Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
