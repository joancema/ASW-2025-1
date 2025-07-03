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

## 🎯 Ventajas de usar `nest g resource`

Al generar recursos con NestJS CLI obtienes:

- **Estructura consistente**: Todos los archivos siguen las convenciones de NestJS
- **Ahorro de tiempo**: Un solo comando genera módulo, gateway, servicio, DTOs y entidad
- **Menos errores**: No hay riesgo de olvidar importaciones o configuraciones
- **CRUD automático**: Los métodos básicos ya vienen implementados
- **Integración automática**: El módulo se agrega automáticamente a `app.module.ts`

## 📖 Guía Paso a Paso: Crear este Proyecto desde Cero

> **Nota**: Esta guía utiliza el comando `nest g resource` que genera automáticamente toda la estructura necesaria para un recurso WebSocket, incluyendo módulo, gateway, servicio, DTOs y entidad. Esto es más eficiente que crear cada archivo por separado.

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

### Paso 3: Generar el recurso de Ciudadanos con WebSocket

```bash
# Generar recurso completo con WebSocket
nest g resource ciudadanos --no-spec

# Cuando pregunte "What transport layer do you use?"
# Seleccionar: WebSockets

# Cuando pregunte "Would you like to generate CRUD entry points?"
# Seleccionar: Yes
```

Esto creará automáticamente:
- Módulo (`ciudadanos.module.ts`)
- Gateway (`ciudadanos.gateway.ts`)
- Servicio (`ciudadanos.service.ts`)
- DTOs (`create-ciudadano.dto.ts`, `update-ciudadano.dto.ts`)
- Entidad (`ciudadano.entity.ts`)
- Estructura de carpetas completa

### Paso 4: Modificar la entidad Ciudadano

El comando anterior ya creó la entidad básica. Ahora la actualizamos con todos los campos necesarios en `src/ciudadanos/entities/ciudadano.entity.ts`:

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

### Paso 5: Actualizar los DTOs

Los DTOs ya fueron creados automáticamente. Actualizamos `src/ciudadanos/dto/create-ciudadano.dto.ts`:

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

El archivo `src/ciudadanos/dto/update-ciudadano.dto.ts` ya fue creado, solo agregamos el campo `id`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadanoDto } from './create-ciudadano.dto';

export class UpdateCiudadanoDto extends PartialType(CreateCiudadanoDto) {
  id: number;
}
```

### Paso 6: Implementar el servicio de Ciudadanos

El servicio ya fue creado con métodos básicos. Actualizamos `src/ciudadanos/ciudadanos.service.ts` con la lógica completa:

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

### Paso 7: Implementar el Gateway de WebSocket

El gateway ya fue creado con la estructura básica. Actualizamos `src/ciudadanos/ciudadanos.gateway.ts` para agregar las emisiones a todos los clientes:

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

### Paso 8: Verificar el módulo principal

El comando `nest g resource` ya agregó automáticamente el `CiudadanosModule` al módulo principal. Verificar que `src/app.module.ts` contenga:

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

### Paso 9: Configurar main.ts (opcional)

El archivo `src/main.ts` ya está configurado por defecto cuando se crea el proyecto:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### 📝 Resumen de archivos generados vs modificados:

**Archivos generados automáticamente por `nest g resource`:**
- ✅ `ciudadanos.module.ts` - No requiere modificación
- ✅ `ciudadanos.gateway.ts` - Modificado para agregar emisiones broadcast
- ✅ `ciudadanos.service.ts` - Modificado para implementar lógica CRUD completa
- ✅ `dto/create-ciudadano.dto.ts` - Modificado para agregar todos los campos
- ✅ `dto/update-ciudadano.dto.ts` - Modificado para agregar el campo `id`
- ✅ `entities/ciudadano.entity.ts` - Modificado para definir todos los campos

**Principales modificaciones realizadas:**
1. Agregar todos los campos de la entidad Ciudadano
2. Implementar almacenamiento en memoria en el servicio
3. Agregar emisiones broadcast en el gateway para notificar a todos los clientes
4. Habilitar CORS en el gateway con `{cors:true}`

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
