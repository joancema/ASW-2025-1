# 🗳️ Aplicación de Votación con NestJS

Este tutorial te guiará paso a paso para crear una aplicación de votación utilizando NestJS, TypeORM y SQLite.

## 📚 Prerrequisitos

- Node.js (versión 16 o superior)
- NPM o Yarn
- Conocimientos básicos de TypeScript
- Editor de código (VS Code recomendado)

## 🚀 Paso 1: Crear el proyecto NestJS

### 1.1 Instalar NestJS CLI globalmente
```bash
npm install -g @nestjs/cli
```

### 1.2 Crear el proyecto
```bash
nest new votacion
cd votacion
```

### 1.3 Verificar que funciona
```bash
npm run start:dev
```
Visita `http://localhost:3000` - deberías ver "Hello World!"

## 📦 Paso 2: Instalar dependencias necesarias

### 2.1 Instalar TypeORM y SQLite
```bash
npm install @nestjs/typeorm typeorm sqlite3
npm install --save-dev @types/sqlite3
```

### 2.2 Instalar validadores
```bash
npm install class-validator class-transformer
```

### 2.3 Instalar mapped-types para DTOs (Solo si creas manualmente)
```bash
npm install @nestjs/mapped-types
```
> 📝 **Nota**: Si usas `nest generate resource` en el Paso 4.1, este paquete se instala automáticamente. Solo instálalo manualmente si creas los DTOs desde cero.

## 🗄️ Paso 3: Configurar TypeORM con SQLite

### 3.1 Modificar `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## 👥 Paso 4: Crear el módulo de Usuarios

### 4.1 Generar el módulo de usuarios

**Opción A: Crear todo de una vez (RECOMENDADO)**
```bash
nest generate resource users
```
Cuando ejecutes este comando, el CLI te preguntará:
- **Transport layer**: Selecciona `REST API`
- **Generate CRUD entry points**: Selecciona `Yes`

Este comando creará automáticamente:
- Módulo (`users.module.ts`)
- Controlador (`users.controller.ts`)
- Servicio (`users.service.ts`)
- Entidad (`entities/user.entity.ts`)
- DTOs (`dto/create-user.dto.ts` y `dto/update-user.dto.ts`)

**Opción B: Crear manualmente (paso a paso)**
```bash
nest generate module users
nest generate service users
nest generate controller users
```

> 💡 **Recomendación**: Usa la **Opción A** con `nest generate resource` ya que es más rápida y genera código base funcional que solo necesitas personalizar. La Opción B es útil para entender cómo funciona cada pieza individualmente.

### 4.2 Modificar la entidad User
Si usaste `nest generate resource`, ya tienes el archivo `src/users/entities/user.entity.ts` creado. Solo necesitas modificarlo.

Si creaste manualmente, crea `src/users/entities/user.entity.ts`:
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column({nullable: true})
    password: string;

    @Column()
    age: number;

    @Column({default: true})
    status: boolean;
}
```

### 4.3 Personalizar DTOs para validación

Si usaste `nest generate resource`, ya tienes los archivos de DTOs creados con contenido básico. Solo necesitas modificarlos para agregar las validaciones.

**Modificar `src/users/dto/create-user.dto.ts`:**
```typescript
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsNumber()
    age: number;

    @IsOptional()
    status: boolean;
}
```

**Verificar `src/users/dto/update-user.dto.ts` (ya debería estar creado si usaste `nest generate resource`):**
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### 4.4 Configurar el módulo de usuarios
Si usaste `nest generate resource`, el módulo ya está configurado básicamente. Solo necesitas agregar TypeORM.

Modificar `src/users/users.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule, UsersService] // Para usar en otros módulos
})
export class UsersModule {}
```

### 4.5 Implementar el servicio de usuarios
Modificar `src/users/users.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Verificar que existe
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id); // Verificar que existe
    user.status = false; // Soft delete
    return await this.userRepository.save(user);
  }
}
```

### 4.6 Implementar el controlador de usuarios
Modificar `src/users/users.controller.ts`:
```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

## 🔧 Paso 5: Configurar validaciones globales, CORS y prefijo de API

### 5.1 Configurar main.ts con todas las características necesarias
Modificar `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir requests desde el frontend
  app.enableCors();
  
  // Establecer prefijo global para todas las rutas (ej: localhost:3000/api/users)
  app.setGlobalPrefix('api');
  
  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo permite propiedades definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma automáticamente los tipos
    }),
  );
  
  await app.listen(3000);
  console.log('🚀 Aplicación corriendo en http://localhost:3000');
  console.log('📋 API disponible en http://localhost:3000/api');
}
bootstrap();
```

### 5.2 ¿Qué hace cada configuración?

**CORS (Cross-Origin Resource Sharing)**:
- Permite que aplicaciones web desde otros dominios hagan peticiones a tu API
- Esencial para desarrollo frontend/backend separado
- `app.enableCors()` habilita CORS para todos los orígenes

**Global Prefix**:
- Agrega un prefijo a todas las rutas de tu API
- Con `app.setGlobalPrefix('api')`, todas las rutas tendrán `/api` al inicio
- Ejemplo: `GET /users` se convierte en `GET /api/users`
- Es una buena práctica para APIs

**ValidationPipe Global**:
- `whitelist: true`: Solo permite propiedades definidas en los DTOs
- `forbidNonWhitelisted: true`: Rechaza requests con propiedades extra
- `transform: true`: Convierte automáticamente strings a números, etc.

## 🚀 Paso 6: Ejecutar la aplicación

### 6.1 Iniciar en modo desarrollo
```bash
npm run start:dev
```

### 6.2 Verificar que SQLite funciona
- Se debe crear automáticamente el archivo `database.sqlite` en la raíz del proyecto
- La aplicación debe iniciar sin errores

### 6.3 Mensajes esperados en la consola
```
🚀 Aplicación corriendo en http://localhost:3000
📋 API disponible en http://localhost:3000/api
```

## 🧪 Paso 7: Probar las rutas (endpoints)

> ⚠️ **IMPORTANTE**: Debido al prefijo global, todas las rutas ahora comienzan con `/api`

### 7.1 Crear un usuario
**POST** `http://localhost:3000/api/users`
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "age": 25
}
```

### 7.2 Obtener todos los usuarios
**GET** `http://localhost:3000/api/users`

### 7.3 Obtener un usuario por ID
**GET** `http://localhost:3000/api/users/1`

### 7.4 Actualizar un usuario
**PATCH** `http://localhost:3000/api/users/1`
```json
{
  "name": "Juan Carlos Pérez",
  "age": 26
}
```

### 7.5 Eliminar un usuario (soft delete)
**DELETE** `http://localhost:3000/api/users/1`
> Nota: Este endpoint cambia el `status` a `false` en lugar de eliminar físicamente el registro

## 🛠️ Herramientas recomendadas para pruebas

### Opción 1: Postman
1. Descargar Postman
2. Crear una nueva colección
3. Agregar requests para cada endpoint
4. **Recordar usar el prefijo `/api` en todas las URLs**

### Opción 2: Thunder Client (VS Code)
1. Instalar extensión Thunder Client en VS Code
2. Crear requests directamente en el editor
3. **Recordar usar el prefijo `/api` en todas las URLs**

### Opción 3: cURL (Terminal)
```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana García","email":"ana@example.com","password":"123456","age":30}'

# Obtener usuarios
curl http://localhost:3000/api/users

# Obtener usuario por ID
curl http://localhost:3000/api/users/1

# Actualizar usuario
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana María García"}'

# Eliminar usuario (soft delete)
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔧 Paso 8: Configuraciones adicionales (Opcional)

### 8.1 Configurar CORS con más opciones
Si necesitas configuración más específica de CORS:
```typescript
// En main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:4200'], // Solo estos orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});
```

### 8.2 Configurar puerto desde variables de entorno
```typescript
// En main.ts
const port = process.env.PORT || 3000;
await app.listen(port);
console.log(`🚀 Aplicación corriendo en http://localhost:${port}`);
```

### 8.3 Agregar manejo de errores global
Crear `src/common/filters/http-exception.filter.ts`:
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}
```

Y aplicarlo globalmente en `main.ts`:
```typescript
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// En bootstrap()
app.useGlobalFilters(new HttpExceptionFilter());
```

## ⚠️ Errores comunes y soluciones

### Error: "Cannot find module 'sqlite3'"
**Solución**: Instalar sqlite3
```bash
npm install sqlite3
npm install --save-dev @types/sqlite3
```

### Error: Validación no funciona
**Solución**: Verificar que ValidationPipe esté configurado globalmente en `main.ts`

### Error: CORS
**Solución**: Verificar que `app.enableCors()` esté en `main.ts`

### Error: Rutas no encontradas
**Solución**: Recordar usar el prefijo `/api` en todas las URLs

### Error: "Cannot read property 'length' of undefined"
**Solución**: Verificar que los DTOs tengan las validaciones correctas

## 📚 Conceptos clave aprendidos

1. **Módulos**: Organización del código en módulos funcionales
2. **Entidades**: Definición de modelos de base de datos con TypeORM
3. **DTOs**: Validación y transformación de datos de entrada
4. **Servicios**: Lógica de negocio y operaciones de base de datos
5. **Controladores**: Manejo de rutas HTTP y respuestas
6. **Inyección de dependencias**: Patrón usado por NestJS
7. **Validaciones**: Uso de class-validator para validar datos
8. **TypeORM**: ORM para manejar base de datos
9. **CLI de NestJS**: Generación automática de código con `nest generate`
10. **CORS**: Configuración para permitir requests de otros dominios
11. **Global Prefix**: Prefijo para todas las rutas de la API
12. **Soft Delete**: Eliminación lógica sin borrar físicamente los datos

## 🔧 Comandos útiles del CLI de NestJS

```bash
# Generar recurso completo (RECOMENDADO)
nest generate resource <nombre>

# Generar componentes individuales
nest generate module <nombre>
nest generate controller <nombre>
nest generate service <nombre>
nest generate class <nombre>
nest generate interface <nombre>
nest generate guard <nombre>
nest generate pipe <nombre>
nest generate filter <nombre>
nest generate interceptor <nombre>

# Comandos abreviados
nest g resource <nombre>
nest g module <nombre>
nest g controller <nombre>
nest g service <nombre>
```

## 🔄 Próximos pasos (extensiones posibles)

1. **Autenticación**: Agregar JWT y guards
2. **Votaciones**: Crear entidades para votos y candidatos
3. **Relaciones**: Establecer relaciones entre entidades
4. **Paginación**: Implementar paginación en listados
5. **Filtros**: Agregar filtros de búsqueda
6. **Documentación**: Integrar Swagger/OpenAPI
7. **Testing**: Escribir tests unitarios y e2e
8. **Docker**: Containerizar la aplicación
9. **Variables de entorno**: Configuración con archivos .env
10. **Logging**: Implementar sistema de logs

## 📝 Estructura final del proyecto

```
votacion/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── database.sqlite
├── package.json
└── README.md
```

## 📋 URLs finales disponibles

Con la configuración actual, tu API tendrá estas URLs:

- **POST** `http://localhost:3000/api/users` - Crear usuario
- **GET** `http://localhost:3000/api/users` - Obtener todos los usuarios
- **GET** `http://localhost:3000/api/users/:id` - Obtener usuario por ID
- **PATCH** `http://localhost:3000/api/users/:id` - Actualizar usuario
- **DELETE** `http://localhost:3000/api/users/:id` - Eliminar usuario (soft delete)

¡Felicidades! 🎉 Has creado tu primera aplicación NestJS completa con TypeORM, SQLite, validaciones, CORS y prefijo de API.
