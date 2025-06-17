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

# Modular Monolithic Architecture Example

Este proyecto implementa una arquitectura de **monolito modular** usando NestJS, TypeORM y SQLite, siguiendo las mejores prácticas de organización de código.

## Arquitectura

```
src/
├── app.module.ts          # Módulo principal de la aplicación
├── main.ts               # Punto de entrada de la aplicación
├── config/               # Configuración centralizada
│   └── configuration.ts  # Configuraciones de base de datos y app
├── common/               # Módulo compartido transversal
│   ├── guards/          # Guards compartidos (AuthGuard)
│   ├── pipes/           # Pipes compartidos (ValidationPipe)
│   └── common.module.ts # Módulo que exporta funcionalidades comunes
├── users/               # Módulo de funcionalidad: Usuarios
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # Entidades de TypeORM
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── products/           # Módulo de funcionalidad: Productos
│   ├── dto/
│   ├── entities/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
└── cars/               # Módulo de funcionalidad: Automóviles
    ├── dto/
    ├── entities/
    ├── cars.controller.ts
    ├── cars.service.ts
    └── cars.module.ts
```

## Características

- ✅ **Arquitectura Modular**: Separación clara de responsabilidades
- ✅ **TypeORM con SQLite**: Base de datos embebida, sin instalación externa
- ✅ **Validación**: DTOs con class-validator
- ✅ **Guards de Autorización**: Middleware de seguridad reutilizable
- ✅ **Configuración Centralizada**: Variables de entorno y configuración
- ✅ **CRUD Completo**: Operaciones Create, Read, Update, Delete

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Variables de Entorno

Crear un archivo `.env` en la raíz:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=database.sqlite
```

## API Endpoints

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Productos

- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear nuevo producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

### Automóviles

- `GET /cars` - Obtener todos los automóviles
- `GET /cars?brand=Toyota` - Filtrar automóviles por marca
- `GET /cars/available` - Obtener automóviles disponibles
- `GET /cars/:id` - Obtener automóvil por ID
- `POST /cars` - Crear nuevo automóvil
- `PATCH /cars/:id` - Actualizar automóvil
- `DELETE /cars/:id` - Eliminar automóvil

## Ejemplo de Uso

### Crear Usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-token" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }'
```

### Crear Producto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-token" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop para gaming de alta gama",
    "price": 1299.99,
    "stock": 10
  }'
```

### Crear Automóvil

```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-token" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2023,
    "color": "Azul",
    "price": 28999.99,
    "mileage": 0
  }'
```

## Autenticación

Todos los endpoints requieren el header:
```
Authorization: Bearer valid-token
```

*Nota: Esto es un ejemplo simple. En producción, implementar JWT real.*

## Estructura de Base de Datos

- **SQLite** como base de datos embebida
- **Sincronización automática** en desarrollo
- **Migraciones** para producción (configurar según necesidades)

## Principios de Arquitectura

1. **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad específica
2. **Reutilización**: Componentes comunes en el módulo `common`
3. **Escalabilidad**: Fácil agregar nuevos módulos
4. **Mantenibilidad**: Código organizado y predecible
5. **Testabilidad**: Estructura facilita testing unitario e integración

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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
