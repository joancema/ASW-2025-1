# Ejemplo de Microservicios con NestJS

Este proyecto demuestra cómo crear una arquitectura de microservicios básica usando NestJS, con un **API Gateway** y un **Microservicio de Ciudadanos** que se comunican a través de **NATS**.

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────┐    NATS    ┌──────────────────┐
│   API Gateway   │ ────────── │ Microservicio    │
│   (Puerto 3000) │            │ Ciudadanos       │
│                 │            │ (Puerto 3001)    │
└─────────────────┘            └──────────────────┘
```

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **NestJS CLI**: `npm i -g @nestjs/cli`

> **Nota**: Según la [documentación oficial de NestJS](https://docs.nestjs.com), no es necesario instalar NATS Server por separado. NestJS maneja la comunicación de microservicios a través de su propio sistema de transporte.

## 🚀 Paso a Paso: Creación del Proyecto

### Paso 1: Crear la Estructura del Proyecto

```bash
# Crear el directorio principal
mkdir ejemploMicro
cd ejemploMicro

# Crear el API Gateway
nest new gateway
cd gateway

# Crear el Microservicio de Ciudadanos
cd ..
nest new ciudadano
```

### Paso 2: Configurar el Microservicio de Ciudadanos

#### 2.1 Instalar Dependencias

```bash
cd ciudadano
npm install @nestjs/microservices dotenv joi
npm install --save-dev @types/node
```

**¿Por qué estas dependencias?**

- **`@nestjs/microservices`**: Proporciona funcionalidades para crear microservicios y comunicación entre ellos
- **`dotenv`**: Carga variables de entorno desde archivos `.env`
- **`joi`**: Biblioteca para validar esquemas de configuración
- **`@types/node`**: Tipos de TypeScript para Node.js (desarrollo)

#### 2.2 Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto `ciudadano`:

```env
NATS_SERVERS=nats://localhost:4222
```

**¿Por qué usar variables de entorno?**

- **Separación de configuración**: Evita hardcodear valores en el código
- **Diferentes entornos**: Permite configuraciones distintas para desarrollo, producción, etc.
- **Seguridad**: No se suben al repositorio (incluir en .gitignore)
- **Flexibilidad**: Fácil cambio de configuración sin modificar código

#### 2.3 Crear la Configuración de Variables de Entorno

Crear `src/config/envs.ts`:

```typescript
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NATS_SERVERS: string[];
}

const envVarsSchema = joi.object({
  NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  NATS_SERVERS: envVars.NATS_SERVERS
};
```

**¿Por qué validar las variables de entorno?**

- **`dotenv/config`**: Carga automáticamente las variables del archivo `.env`
- **`joi`**: Valida que las variables requeridas existan y tengan el formato correcto
- **`split(',')`**: Permite múltiples servidores NATS separados por comas
- **Validación temprana**: Falla rápido si la configuración es incorrecta
- **Type Safety**: TypeScript conoce los tipos de las variables validadas

#### 2.4 Crear la Entidad Ciudadano

Crear `src/ciudadanos/entities/ciudadano.entity.ts`:

```typescript
export class Ciudadano {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  activo: boolean;
}
```

**¿Por qué usar entidades?**

- **Modelo de datos**: Define la estructura de los datos del dominio
- **Type Safety**: TypeScript puede verificar tipos en tiempo de compilación
- **Documentación**: Sirve como documentación del modelo de datos
- **Consistencia**: Asegura que todos los servicios usen la misma estructura
- **Separación de responsabilidades**: Separa la lógica de negocio de la estructura de datos

#### 2.5 Crear DTOs

Crear `src/ciudadanos/dto/create-ciudadano.dto.ts`:

```typescript
import { IsEmail, IsNumber, IsString, Min } from 'class-validator';

export class CreateCiudadanoDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  edad: number;
}
```

Crear `src/ciudadanos/dto/update-ciudadano.dto.ts`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadanoDto } from './create-ciudadano.dto';

export class UpdateCiudadanoDto extends PartialType(CreateCiudadanoDto) {}
```

**¿Por qué usar DTOs?**

- **`@IsString()`, `@IsEmail()`, `@IsNumber()`**: Decoradores de validación automática
- **`@Min(0)`**: Valida que la edad sea mayor o igual a 0
- **Validación automática**: NestJS valida automáticamente los datos entrantes
- **`PartialType()`**: Hace todas las propiedades opcionales para actualizaciones
- **Seguridad**: Previene datos maliciosos o incorrectos
- **Documentación**: Los DTOs sirven como contrato de la API

#### 2.6 Crear el Servicio de Ciudadanos

Crear `src/ciudadanos/ciudadanos.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { Ciudadano } from './entities/ciudadano.entity';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Injectable()
export class CiudadanosService {
  private ciudadanos: Ciudadano[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      edad: 25,
      activo: true,
    },
  ];

  create(createCiudadanoDto: CreateCiudadanoDto) {
    const ciudadano = {
      id: this.ciudadanos.length + 1,
      ...createCiudadanoDto,
      activo: true,
    };
    this.ciudadanos.push(ciudadano);
    return ciudadano;
  }

  findAll() {
    return this.ciudadanos;
  }

  findOne(id: number) {
    return this.ciudadanos.find(ciudadano => ciudadano.id === id);
  }

  update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    const index = this.ciudadanos.findIndex(ciudadano => ciudadano.id === id);
    if (index >= 0) {
      this.ciudadanos[index] = { ...this.ciudadanos[index], ...updateCiudadanoDto };
      return this.ciudadanos[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.ciudadanos.findIndex(ciudadano => ciudadano.id === id);
    if (index >= 0) {
      const ciudadano = this.ciudadanos[index];
      this.ciudadanos.splice(index, 1);
      return ciudadano;
    }
    return null;
  }
}
```

**¿Por qué este servicio contiene la lógica de negocio?**

- **`@Injectable()`**: Permite que NestJS inyecte este servicio en otros componentes
- **Lógica de negocio**: Contiene todas las operaciones CRUD para ciudadanos
- **Datos en memoria**: Usa un array para simular una base de datos (en producción usarías una DB real)
- **ID automático**: Genera IDs incrementales para nuevos ciudadanos
- **`activo: true`**: Establece valores por defecto para nuevos registros
- **Operaciones CRUD**: Create, Read, Update, Delete completos

#### 2.7 Crear el Controlador de Ciudadanos

Crear `src/ciudadanos/ciudadanos.controller.ts`:

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CiudadanosService } from './ciudadanos.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Controller()
export class CiudadanosController {
  constructor(private readonly ciudadanosService: CiudadanosService) {}

  @MessagePattern('createCiudadano')
  create(@Payload() createCiudadanoDto: CreateCiudadanoDto) {
    return this.ciudadanosService.create(createCiudadanoDto);
  }

  @MessagePattern('findAllCiudadanos')
  findAll() {
    return this.ciudadanosService.findAll();
  }

  @MessagePattern('findOneCiudadano')
  findOne(@Payload() id: number) {
    return this.ciudadanosService.findOne(id);
  }

  @MessagePattern('updateCiudadano')
  update(@Payload() payload: { id: number; updateCiudadanoDto: UpdateCiudadanoDto }) {
    return this.ciudadanosService.update(payload.id, payload.updateCiudadanoDto);
  }

  @MessagePattern('removeCiudadano')
  remove(@Payload() id: number) {
    return this.ciudadanosService.remove(id);
  }
}
```

**¿Por qué este controlador usa MessagePatterns?**

- **`@MessagePattern()`**: Define patrones de mensaje que el microservicio escuchará
- **`@Payload()`**: Extrae los datos del mensaje recibido
- **Comunicación asíncrona**: Los microservicios se comunican por mensajes, no HTTP
- **Patrones únicos**: Cada operación tiene un patrón específico ('createCiudadano', 'findAllCiudadanos', etc.)
- **Sin rutas HTTP**: Los microservicios no exponen endpoints HTTP directamente
- **Desacoplamiento**: El gateway y microservicio se comunican sin conocer detalles de implementación

#### 2.8 Crear el Módulo de Ciudadanos

Crear `src/ciudadanos/ciudadanos.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosController } from './ciudadanos.controller';

@Module({
  controllers: [CiudadanosController],
  providers: [CiudadanosService],
})
export class CiudadanosModule {}
```

**¿Por qué usar módulos?**

- **`@Module()`**: Define un módulo de NestJS que agrupa funcionalidades relacionadas
- **`controllers`**: Lista los controladores que manejan las peticiones
- **`providers`**: Lista los servicios que contienen la lógica de negocio
- **Inyección de dependencias**: NestJS inyecta automáticamente el servicio en el controlador
- **Organización**: Agrupa código relacionado en unidades lógicas
- **Reutilización**: Los módulos pueden ser importados en otros módulos

#### 2.9 Configurar el Módulo Principal

Actualizar `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosModule } from './ciudadanos/ciudadanos.module';

@Module({
  imports: [CiudadanosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**¿Por qué este es el módulo principal?**

- **`imports`**: Importa otros módulos que necesita la aplicación
- **Módulo raíz**: Es el punto de entrada principal de la aplicación
- **Configuración global**: Aquí se configuran todos los módulos de la aplicación
- **Sin controladores directos**: Los controladores están en módulos específicos
- **Sin providers directos**: Los servicios están en módulos específicos

#### 2.10 Configurar el Punto de Entrada

Actualizar `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('microciudadanos');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.NATS_SERVERS,
      maxReconnectAttempts: -1,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  await app.listen();
  logger.log('Microservicio Ciudadanos escuchando');
}
bootstrap();
```

**¿Por qué esta configuración?**

- **`createMicroservice()`**: Crea una aplicación de microservicio en lugar de una aplicación HTTP tradicional
- **`Transport.NATS`**: Define NATS como el protocolo de comunicación entre microservicios
- **`maxReconnectAttempts: -1`**: Permite reconexiones infinitas si se pierde la conexión con NATS
- **`ValidationPipe`**: Valida automáticamente todos los datos entrantes según los DTOs
- **`whitelist: true`**: Solo permite propiedades definidas en los DTOs
- **`forbidNonWhitelisted: true`**: Rechaza propiedades no definidas en los DTOs

### Paso 3: Configurar el API Gateway

#### 3.1 Instalar Dependencias

```bash
cd ../gateway
npm install @nestjs/microservices dotenv joi
npm install --save-dev @types/node
```

**¿Por qué las mismas dependencias que el microservicio?**

- **`@nestjs/microservices`**: Necesario para comunicarse con microservicios
- **`dotenv`**: Para cargar variables de entorno del gateway
- **`joi`**: Para validar la configuración del gateway
- **Consistencia**: Ambos proyectos necesitan las mismas herramientas de comunicación

#### 3.2 Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto `gateway`:

```env
PORT=3000
NATS_SERVERS=nats://localhost:4222
```

**¿Por qué el gateway necesita PORT?**

- **`PORT=3000`**: Puerto donde el gateway escuchará peticiones HTTP
- **`NATS_SERVERS`**: Misma configuración que el microservicio para comunicación
- **Servidor HTTP**: El gateway expone una API REST en el puerto especificado
- **Punto de entrada**: Los clientes se conectan al gateway, no directamente a los microservicios

#### 3.3 Crear la Configuración de Variables de Entorno

Crear `src/config/envs.ts` (similar al microservicio pero con PORT):

```typescript
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi.object({
  PORT: joi.number().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  NATS_SERVERS: envVars.NATS_SERVERS
};
```

**¿Por qué validar PORT además de NATS_SERVERS?**

- **`PORT`**: Valida que el puerto sea un número válido
- **Validación temprana**: Falla si el puerto no está configurado correctamente
- **Type Safety**: TypeScript conoce que PORT es un número
- **Configuración dual**: El gateway necesita tanto configuración HTTP como de microservicios

#### 3.4 Crear el Módulo de Transporte NATS

Crear `src/transports/nats.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: envs.NATS_SERVERS,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
```

**¿Por qué este módulo?**

- **`ClientsModule.register()`**: Registra un cliente NATS que puede enviar mensajes a microservicios
- **`name: 'NATS_SERVICE'`**: Identificador único para inyectar este cliente en otros servicios
- **`transport: Transport.NATS`**: Especifica que usaremos NATS como protocolo
- **`exports: [ClientsModule]`**: Hace que el cliente NATS esté disponible para otros módulos

#### 3.5 Crear DTOs y Entidades (igual que en el microservicio)

Copiar los archivos de `dto/` y `entities/` del microservicio al gateway.

**¿Por qué necesitamos los mismos DTOs en ambos proyectos?**

- **Consistencia**: Los DTOs deben ser idénticos para que la validación funcione correctamente
- **Validación**: El gateway valida los datos antes de enviarlos al microservicio
- **Type Safety**: TypeScript necesita conocer la estructura de los datos en ambos lados
- **Documentación**: Los DTOs sirven como contrato entre el gateway y el microservicio

#### 3.6 Crear el Servicio de Ciudadanos en el Gateway

Crear `src/ciudadanos/ciudadanos.service.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Injectable()
export class CiudadanosService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  create(createCiudadanoDto: CreateCiudadanoDto) {
    return this.natsClient.send('createCiudadano', createCiudadanoDto);
  }

  findAll() {
    return this.natsClient.send('findAllCiudadanos', {});
  }

  findOne(id: number) {
    return this.natsClient.send('findOneCiudadano', id);
  }

  update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    return this.natsClient.send('updateCiudadano', { id, updateCiudadanoDto });
  }

  remove(id: number) {
    return this.natsClient.send('removeCiudadano', id);
  }
}
```

**¿Por qué este servicio es diferente al del microservicio?**

- **`@Inject('NATS_SERVICE')`**: Inyecta el cliente NATS registrado en el módulo de transporte
- **`ClientProxy`**: Interfaz para enviar mensajes a microservicios
- **`natsClient.send()`**: Envía mensajes a través de NATS usando patrones específicos
- **Patrones de mensaje**: Cada método usa un patrón diferente que coincide con el microservicio
- **Sin lógica de negocio**: Solo actúa como proxy hacia el microservicio real

#### 3.7 Crear el Controlador de Ciudadanos en el Gateway

Crear `src/ciudadanos/ciudadanos.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Controller('ciudadanos')
export class CiudadanosController {
  constructor(private readonly ciudadanosService: CiudadanosService) {}

  @Post()
  create(@Body() createCiudadanoDto: CreateCiudadanoDto) {
    return this.ciudadanosService.create(createCiudadanoDto);
  }

  @Get()
  findAll() {
    return this.ciudadanosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ciudadanosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadanoDto: UpdateCiudadanoDto) {
    return this.ciudadanosService.update(+id, updateCiudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ciudadanosService.remove(+id);
  }
}
```

**¿Por qué este controlador usa decoradores HTTP?**

- **`@Controller('ciudadanos')`**: Define la ruta base para todos los endpoints
- **`@Post()`, `@Get()`, `@Patch()`, `@Delete()`**: Decoradores HTTP estándar para REST APIs
- **`@Body()`**: Extrae el cuerpo de la petición HTTP
- **`@Param()`**: Extrae parámetros de la URL
- **`+id`**: Convierte el string del parámetro a número
- **REST API**: Expone una interfaz HTTP estándar para los clientes

#### 3.8 Crear el Módulo de Ciudadanos en el Gateway

Crear `src/ciudadanos/ciudadanos.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosController } from './ciudadanos.controller';

@Module({
  controllers: [CiudadanosController],
  providers: [CiudadanosService],
})
export class CiudadanosModule {}
```

**¿Por qué el mismo módulo que en el microservicio?**

- **Estructura similar**: Misma organización de código para consistencia
- **Inyección de dependencias**: NestJS inyecta el servicio en el controlador
- **Separación de responsabilidades**: Controlador maneja HTTP, servicio maneja comunicación con microservicios
- **Reutilización**: La estructura modular facilita el mantenimiento

#### 3.9 Configurar el Módulo Principal del Gateway

Actualizar `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosModule } from './ciudadanos/ciudadanos.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [CiudadanosModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**¿Por qué importar NatsModule además de CiudadanosModule?**

- **`NatsModule`**: Proporciona el cliente NATS necesario para comunicación
- **`CiudadanosModule`**: Contiene los controladores y servicios del dominio
- **Dependencias**: El servicio de ciudadanos necesita el cliente NATS
- **Configuración completa**: Ambos módulos son necesarios para que el gateway funcione

#### 3.10 Crear el Filtro de Excepciones RPC

Crear `src/common/exceptions/rpc-custom-exceptions.filter.ts`:

```typescript
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();

        if (rpcError.toString().includes('Empty response')) {
            response.status(500).json({
                statusCode: 500,
                message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
            });
            return;
        }

        if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
            const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
            response.status(status).json(rpcError);
        }
        
        response.status(400).json({
            statusCode: 400,
            message: rpcError,
        });
    }
}
```

**¿Por qué necesitamos este filtro?**

- **`@Catch(RpcException)`**: Captura específicamente excepciones de microservicios
- **Manejo de errores RPC**: Convierte errores de microservicios en respuestas HTTP apropiadas
- **"Empty response"**: Maneja casos donde el microservicio no responde
- **Códigos de estado HTTP**: Mapea errores RPC a códigos HTTP estándar
- **Respuestas consistentes**: Asegura que todos los errores tengan el mismo formato

#### 3.11 Configurar el Punto de Entrada del Gateway

Actualizar `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exceptions.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.PORT);
  logger.log(`Gateway is running on port ${envs.PORT}`);
}
bootstrap();
```

**¿Por qué esta configuración del gateway?**

- **`create()`**: Crea una aplicación HTTP tradicional (no microservicio)
- **`setGlobalPrefix('api')`**: Agrega `/api` a todas las rutas
- **`ValidationPipe`**: Valida datos entrantes según los DTOs
- **`useGlobalFilters()`**: Aplica el filtro de excepciones RPC globalmente
- **`listen(envs.PORT)`**: Escucha en el puerto configurado para peticiones HTTP

## 🚀 Ejecutar el Proyecto

### Paso 1: Ejecutar el Microservicio de Ciudadanos

```bash
cd ciudadano
npm run start:dev
```

### Paso 2: Ejecutar el API Gateway

```bash
cd gateway
npm run start:dev
```

## 📡 Endpoints Disponibles

Una vez que ambos servicios estén ejecutándose, puedes probar los siguientes endpoints:

### API Gateway (http://localhost:3000/api)

- `GET /ciudadanos` - Obtener todos los ciudadanos
- `GET /ciudadanos/:id` - Obtener un ciudadano por ID
- `POST /ciudadanos` - Crear un nuevo ciudadano
- `PATCH /ciudadanos/:id` - Actualizar un ciudadano
- `DELETE /ciudadanos/:id` - Eliminar un ciudadano

### Ejemplo de Uso con cURL

```bash
# Crear un ciudadano
curl -X POST http://localhost:3000/api/ciudadanos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "edad": 30
  }'

# Obtener todos los ciudadanos
curl http://localhost:3000/api/ciudadanos

# Obtener un ciudadano específico
curl http://localhost:3000/api/ciudadanos/1
```

## 🔍 Flujo de Comunicación

1. **Cliente** → **API Gateway** (HTTP/REST)
2. **API Gateway** → **NATS** (mensaje)
3. **NATS** → **Microservicio Ciudadanos** (mensaje)
4. **Microservicio Ciudadanos** → **NATS** (respuesta)
5. **NATS** → **API Gateway** (respuesta)
6. **API Gateway** → **Cliente** (HTTP/REST)

**¿Por qué este flujo de comunicación?**

- **Punto único de entrada**: Los clientes solo conocen el gateway, no los microservicios
- **Desacoplamiento**: Los microservicios no necesitan exponer APIs HTTP
- **Escalabilidad**: Puedes escalar microservicios independientemente
- **Seguridad**: El gateway puede implementar autenticación y autorización
- **Transformación**: El gateway puede transformar datos entre diferentes formatos
- **Resiliencia**: Si un microservicio falla, el gateway puede manejar el error

## 📚 Conceptos Clave Explicados

### Microservicios
- **Definición**: Arquitectura donde una aplicación se divide en servicios pequeños e independientes
- **Ventajas**: Escalabilidad, mantenibilidad, tecnologías independientes
- **Desventajas**: Complejidad de comunicación, gestión de datos distribuidos

### API Gateway
- **Propósito**: Punto de entrada único para todos los clientes
- **Funciones**: Enrutamiento, autenticación, rate limiting, transformación de datos

### Transport Layer (NATS)
- **Tipo**: Sistema de transporte para comunicación entre microservicios
- **Características**: Manejo automático por NestJS, no requiere instalación separada
- **Patrón**: Publish/Subscribe a través del sistema de microservicios de NestJS

### Message Patterns en NestJS
- `@MessagePattern()`: Define el patrón de mensaje que el controlador escuchará
- `@Payload()`: Extrae los datos del mensaje recibido

## 🛠️ Comandos Útiles

```bash
# Generar un nuevo módulo
nest generate module nombre-modulo

# Generar un nuevo controlador
nest generate controller nombre-controlador

# Generar un nuevo servicio
nest generate service nombre-servicio

# Construir el proyecto
npm run build

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch
```

## 🔧 Solución de Problemas

### Error: "NATS connection failed"
- Verificar que el microservicio esté ejecutándose correctamente
- Comprobar la configuración de `NATS_SERVERS` en el archivo `.env`
- Asegurarse de que ambos servicios (gateway y microservicio) estén corriendo

### Error: "Port already in use"
- Cambiar el puerto en el archivo `.env`
- Verificar que no haya otros servicios usando el mismo puerto

### Error: "Validation failed"
- Verificar que los datos enviados cumplan con las validaciones de los DTOs
- Revisar los decoradores de validación en los DTOs

## 📖 Recursos Adicionales

- [Documentación oficial de NestJS](https://docs.nestjs.com/)
- [Documentación de Microservicios en NestJS](https://docs.nestjs.com/microservices/basics)
- [Guía de Transportes en NestJS](https://docs.nestjs.com/microservices/transports)
- [Patrones de Microservicios](https://microservices.io/patterns/)

## 🤝 Contribuir

Este proyecto es educativo y está diseñado para estudiantes universitarios. Si encuentras errores o tienes sugerencias de mejora, no dudes en contribuir.

---

**¡Feliz programación! 🚀** 