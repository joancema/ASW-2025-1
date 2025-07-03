# CRUD WebSocket con NestJS

## 📋 Descripción

Esta aplicación es un sistema CRUD (Create, Read, Update, Delete) para gestión de ciudadanos implementado con NestJS y WebSockets usando Socket.io. A diferencia de las APIs REST tradicionales, toda la comunicación entre cliente y servidor se realiza a través de WebSockets, permitiendo comunicación bidireccional en tiempo real.

## ✨ Características

- **CRUD completo** para entidad Ciudadano
- **WebSocket Gateway** con Socket.io
- **Comunicación en tiempo real**
- **Emisión de eventos** a todos los clientes conectados
- **Estructura modular** siguiendo las mejores prácticas de NestJS
- **TypeScript** para type safety

## 🚀 Instalación y Uso Rápido

### Prerequisitos
- Node.js (v16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <tu-repositorio>

# Navegar al directorio del proyecto
cd typescript/semana11/crudws/crud

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Guía Paso a Paso: Crear este Proyecto desde Cero

### Paso 1: Crear un nuevo proyecto NestJS

```bash
# Instalar NestJS CLI globalmente si no lo tienes
npm i -g @nestjs/cli

# Crear nuevo proyecto
nest new crud

# Navegar al directorio del proyecto
cd crud
```

### Paso 2: Instalar dependencias de WebSocket

```bash
# Instalar paquetes necesarios para WebSocket
npm i @nestjs/websockets @nestjs/platform-socket.io socket.io
npm i @nestjs/mapped-types
```

### Paso 3: Generar el módulo de Ciudadanos

```bash
# Generar módulo, servicio y gateway
nest g module ciudadanos
nest g service ciudadanos
nest g gateway ciudadanos
```

### Paso 4: Crear la estructura de carpetas

```bash
# Crear carpetas para DTOs y entidades
mkdir src/ciudadanos/dto
mkdir src/ciudadanos/entities
```

### Paso 5: Crear la entidad Ciudadano

Crear archivo `src/ciudadanos/entities/ciudadano.entity.ts`:

```typescript
export class Ciudadano {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    email: string;
}
```

### Paso 6: Crear los DTOs

Crear archivo `src/ciudadanos/dto/create-ciudadano.dto.ts`:

```typescript
export class CreateCiudadanoDto {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    email: string;
}
```

Crear archivo `src/ciudadanos/dto/update-ciudadano.dto.ts`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadanoDto } from './create-ciudadano.dto';

export class UpdateCiudadanoDto extends PartialType(CreateCiudadanoDto) {
  id: number;
}
```

### Paso 7: Implementar el servicio de Ciudadanos

Actualizar `src/ciudadanos/ciudadanos.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { Ciudadano } from './entities/ciudadano.entity';

@Injectable()
export class CiudadanosService {
  private ciudadanos: Ciudadano[] = [];
  
  create(createCiudadanoDto: CreateCiudadanoDto) {
    const newCiudadano = {
      ...createCiudadanoDto,
      id: this.ciudadanos.length + 1
    };
    this.ciudadanos.push(newCiudadano);
    return newCiudadano;
  }

  findAll() {
    return this.ciudadanos;
  }

  findOne(id: number) {
    return this.ciudadanos.find(ciudadano => ciudadano.id === id);
  }

  update(id: number, updateCiudadanoDto: UpdateCiudadanoDto) {
    const index = this.ciudadanos.findIndex(ciudadano => ciudadano.id === id);
    if (index !== -1) {
      this.ciudadanos[index] = { ...this.ciudadanos[index], ...updateCiudadanoDto };
      return this.ciudadanos[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.ciudadanos.findIndex(ciudadano => ciudadano.id === id);
    if (index !== -1) {
      const removed = this.ciudadanos.splice(index, 1);
      return removed[0];
    }
    return null;
  }
}
```

### Paso 8: Implementar el Gateway de WebSocket

Actualizar `src/ciudadanos/ciudadanos.gateway.ts`:

```typescript
import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { CiudadanosService } from './ciudadanos.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { Server } from 'socket.io';

@WebSocketGateway({cors:true})
export class CiudadanosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(private readonly ciudadanosService: CiudadanosService) {}
  
  handleDisconnect(client: any) {
    console.log('Cliente desconectado:', client.id);
  }
  
  handleConnection(client: any, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    console.log(`Cliente conectado: ${client.id}, token: ${token}`);
  }

  @SubscribeMessage('createCiudadano')
  create(@MessageBody() createCiudadanoDto: CreateCiudadanoDto) {
    const inserted = this.ciudadanosService.create(createCiudadanoDto);
    // Emitir a todos los clientes la lista actualizada
    this.wss.emit('newCiudadano', this.findAll());
    return inserted;
  }

  @SubscribeMessage('findAllCiudadanos')
  findAll() {
    return this.ciudadanosService.findAll();
  }

  @SubscribeMessage('findOneCiudadano')
  findOne(@MessageBody() id: number) {
    return this.ciudadanosService.findOne(id);
  }

  @SubscribeMessage('updateCiudadano')
  update(@MessageBody() updateCiudadanoDto: UpdateCiudadanoDto) {
    const updated = this.ciudadanosService.update(updateCiudadanoDto.id, updateCiudadanoDto);
    // Emitir a todos los clientes la lista actualizada
    this.wss.emit('updatedCiudadano', this.findAll());
    return updated;
  }

  @SubscribeMessage('removeCiudadano')
  remove(@MessageBody() id: number) {
    const removed = this.ciudadanosService.remove(id);
    // Emitir a todos los clientes la lista actualizada
    this.wss.emit('removedCiudadano', this.findAll());
    return removed;
  }
}
```

### Paso 9: Configurar el módulo de Ciudadanos

Actualizar `src/ciudadanos/ciudadanos.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CiudadanosService } from './ciudadanos.service';
import { CiudadanosGateway } from './ciudadanos.gateway';

@Module({
  providers: [CiudadanosGateway, CiudadanosService],
})
export class CiudadanosModule {}
```

### Paso 10: Configurar el módulo principal

Actualizar `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadanosModule } from './ciudadanos/ciudadanos.module';

@Module({
  imports: [CiudadanosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Paso 11: Configurar main.ts (opcional)

El archivo `src/main.ts` ya está configurado por defecto:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## 📁 Estructura del Proyecto

```
crud/
├── src/
│   ├── ciudadanos/
│   │   ├── dto/
│   │   │   ├── create-ciudadano.dto.ts
│   │   │   └── update-ciudadano.dto.ts
│   │   ├── entities/
│   │   │   └── ciudadano.entity.ts
│   │   ├── ciudadanos.gateway.ts
│   │   ├── ciudadanos.module.ts
│   │   └── ciudadanos.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── nest-cli.json
├── tsconfig.json
└── README.md
```

## 🔌 Eventos WebSocket

### Eventos que el cliente puede emitir:

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `createCiudadano` | Crear un nuevo ciudadano | `CreateCiudadanoDto` |
| `findAllCiudadanos` | Obtener todos los ciudadanos | - |
| `findOneCiudadano` | Obtener un ciudadano por ID | `number` (id) |
| `updateCiudadano` | Actualizar un ciudadano | `UpdateCiudadanoDto` |
| `removeCiudadano` | Eliminar un ciudadano | `number` (id) |

### Eventos que el servidor emite:

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `newCiudadano` | Se creó un nuevo ciudadano | Array de todos los ciudadanos |
| `updatedCiudadano` | Se actualizó un ciudadano | Array de todos los ciudadanos |
| `removedCiudadano` | Se eliminó un ciudadano | Array de todos los ciudadanos |

## 💻 Ejemplo de Cliente (JavaScript/HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cliente WebSocket - CRUD Ciudadanos</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
    <h1>CRUD Ciudadanos WebSocket</h1>
    
    <script>
        // Conectar al servidor WebSocket
        const socket = io('http://localhost:3000', {
            extraHeaders: {
                authentication: 'mi-token-secreto'
            }
        });

        // Escuchar eventos del servidor
        socket.on('connect', () => {
            console.log('Conectado al servidor');
            
            // Obtener todos los ciudadanos al conectar
            socket.emit('findAllCiudadanos', {}, (ciudadanos) => {
                console.log('Ciudadanos:', ciudadanos);
            });
        });

        socket.on('newCiudadano', (ciudadanos) => {
            console.log('Lista actualizada después de crear:', ciudadanos);
        });

        socket.on('updatedCiudadano', (ciudadanos) => {
            console.log('Lista actualizada después de actualizar:', ciudadanos);
        });

        socket.on('removedCiudadano', (ciudadanos) => {
            console.log('Lista actualizada después de eliminar:', ciudadanos);
        });

        // Ejemplo: Crear un nuevo ciudadano
        function crearCiudadano() {
            const nuevoCiudadano = {
                nombre: 'Juan',
                apellido: 'Pérez',
                edad: 30,
                fechaNacimiento: '1993-01-15',
                direccion: 'Calle Principal 123',
                telefono: '555-1234',
                email: 'juan@example.com'
            };

            socket.emit('createCiudadano', nuevoCiudadano, (response) => {
                console.log('Ciudadano creado:', response);
            });
        }

        // Ejemplo: Actualizar un ciudadano
        function actualizarCiudadano(id) {
            const datosActualizados = {
                id: id,
                nombre: 'Juan Carlos',
                edad: 31
            };

            socket.emit('updateCiudadano', datosActualizados, (response) => {
                console.log('Ciudadano actualizado:', response);
            });
        }

        // Ejemplo: Eliminar un ciudadano
        function eliminarCiudadano(id) {
            socket.emit('removeCiudadano', id, (response) => {
                console.log('Ciudadano eliminado:', response);
            });
        }
    </script>
</body>
</html>
```

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e
npm run test:e2e

# Ejecutar pruebas con coverage
npm run test:cov
```

## 📝 Notas Adicionales

- La aplicación usa almacenamiento en memoria, los datos se perderán al reiniciar el servidor
- Para producción, considera implementar una base de datos real (PostgreSQL, MongoDB, etc.)
- Puedes agregar validación de datos usando class-validator
- Considera implementar autenticación y autorización para proteger los endpoints
- Para debugging, puedes usar las herramientas de desarrollo de Chrome para WebSocket

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia UNLICENSED.
