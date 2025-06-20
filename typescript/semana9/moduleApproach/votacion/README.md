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

### 2.3 Instalar mapped-types para DTOs
```bash
npm install @nestjs/mapped-types
```

## 🗄️ Paso 3: Configurar TypeORM con SQLite

### 3.1 Modificar `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Para usar en otros módulos
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
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Verificar que existe
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe
    await this.usersRepository.delete(id);
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

### 4.7 Importar el módulo Users en AppModule
Modificar `src/app.module.ts`:
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

## 🔧 Paso 5: Configurar validaciones globales

### 5.1 Habilitar ValidationPipe globalmente
Modificar `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(3000);
  console.log('🚀 Aplicación corriendo en http://localhost:3000');
}
bootstrap();
```

## 🚀 Paso 6: Ejecutar la aplicación

### 6.1 Iniciar en modo desarrollo
```bash
npm run start:dev
```

### 6.2 Verificar que SQLite funciona
- Se debe crear automáticamente el archivo `database.sqlite` en la raíz del proyecto
- La aplicación debe iniciar sin errores

## 🧪 Paso 7: Probar las rutas (endpoints)

### 7.1 Crear un usuario
**POST** `http://localhost:3000/users`
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "age": 25
}
```

### 7.2 Obtener todos los usuarios
**GET** `http://localhost:3000/users`

### 7.3 Obtener un usuario por ID
**GET** `http://localhost:3000/users/1`

### 7.4 Actualizar un usuario
**PATCH** `http://localhost:3000/users/1`
```json
{
  "name": "Juan Carlos Pérez",
  "age": 26
}
```

### 7.5 Eliminar un usuario
**DELETE** `http://localhost:3000/users/1`

## 🛠️ Herramientas recomendadas para pruebas

### Opción 1: Postman
1. Descargar Postman
2. Crear una nueva colección
3. Agregar requests para cada endpoint

### Opción 2: Thunder Client (VS Code)
1. Instalar extensión Thunder Client en VS Code
2. Crear requests directamente en el editor

### Opción 3: cURL (Terminal)
```bash
# Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana García","email":"ana@example.com","password":"123456","age":30}'

# Obtener usuarios
curl http://localhost:3000/users
```

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

¡Felicidades! 🎉 Has creado tu primera aplicación NestJS con TypeORM y SQLite.
