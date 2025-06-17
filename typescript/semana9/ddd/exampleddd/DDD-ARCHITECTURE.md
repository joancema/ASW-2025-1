# Arquitectura DDD (Domain-Driven Design)

Este proyecto implementa una arquitectura DDD siguiendo los principios y patrones de Domain-Driven Design.

## Estructura del Proyecto

```
src/
├── lending/                          # Contexto acotado (bounded context)
│   ├── domain/                       # Capa de Dominio
│   │   ├── aggregates/               # Agregados
│   │   │   └── book.aggregate.ts     # Agregado Book
│   │   ├── entities/                 # Entidades de dominio
│   │   │   └── book.entity.ts        # Entidad Book
│   │   ├── value-objects/            # Objetos de valor
│   │   │   └── book-id.vo.ts         # Value Object BookId
│   │   ├── repositories/             # Interfaces de repositorio
│   │   │   └── book.repository.ts    # Interfaz BookRepository
│   │   └── events/                   # Eventos de dominio
│   │       └── book-lent.event.ts    # Evento BookLent
│   ├── application/                  # Capa de Aplicación
│   │   ├── use-cases/                # Casos de uso
│   │   │   └── create-book.use-case.ts # Caso de uso crear libro
│   │   └── dto/                      # Data Transfer Objects
│   │       └── create-book.dto.ts    # DTO para crear libro
│   ├── infrastructure/               # Capa de Infraestructura
│   │   ├── persistence/              # Persistencia
│   │   │   └── typeorm/              # Implementación TypeORM
│   │   │       └── book.typeorm.entity.ts # Entidad TypeORM
│   │   └── repositories/             # Implementaciones de repositorio
│   │       └── book.repository.impl.ts # Implementación concreta
│   └── lending.module.ts             # Módulo NestJS
├── presentation/                     # Capa de Presentación
│   └── http/                         # Controladores HTTP
│       └── lending.controller.ts     # Controlador REST
├── framework/                        # Framework y librerías
│   └── libraries/                    # Constantes y utilidades
│       └── constants.ts              # Tokens de inyección
└── app.module.ts                     # Módulo principal
```

## Capas de la Arquitectura

### 1. Capa de Dominio (`domain/`)
La capa más interna que contiene la lógica de negocio pura:

- **Entidades**: Objetos con identidad que encapsulan lógica de negocio
- **Agregados**: Raíces de agregado que mantienen la consistencia del dominio
- **Value Objects**: Objetos inmutables que describen características
- **Repositorios**: Interfaces para acceso a datos (sin implementación)
- **Eventos**: Eventos de dominio para comunicación entre agregados

### 2. Capa de Aplicación (`application/`)
Orquesta los casos de uso del sistema:

- **Use Cases**: Casos de uso específicos de la aplicación
- **DTOs**: Objetos de transferencia de datos para las interfaces

### 3. Capa de Infraestructura (`infrastructure/`)
Implementa los detalles técnicos:

- **Persistencia**: Implementaciones de acceso a datos
- **Repositorios**: Implementaciones concretas de las interfaces del dominio

### 4. Capa de Presentación (`presentation/`)
Maneja la interacción con el exterior:

- **Controladores HTTP**: Endpoints REST para la API

## Principios DDD Aplicados

### 1. Separación de Responsabilidades
- Cada capa tiene responsabilidades específicas
- La lógica de negocio está aislada en el dominio
- Las dependencias apuntan hacia adentro (Dependency Inversion)

### 2. Agregados
- `BookAggregate` es la raíz del agregado
- Mantiene la invariantes de negocio
- Controla el acceso a las entidades

### 3. Repositorios
- Interfaces definidas en el dominio
- Implementaciones en la infraestructura
- Abstrae el acceso a datos

### 4. Casos de Uso
- Cada caso de uso representa una funcionalidad específica
- Orquesta las operaciones del dominio
- No contiene lógica de negocio

## Endpoints Disponibles

### Crear Libro
```http
POST /lending/books
Content-Type: application/json

{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "978-0134494166"
}
```

### Obtener Todos los Libros
```http
GET /lending/books
```

### Obtener Libro por ID
```http
GET /lending/books/:id
```

## Beneficios de Esta Arquitectura

1. **Mantenibilidad**: Código organizado y fácil de mantener
2. **Testabilidad**: Capas desacopladas permiten testing unitario efectivo
3. **Flexibilidad**: Fácil cambio de tecnologías de infraestructura
4. **Escalabilidad**: Estructura clara para agregar nuevas funcionalidades
5. **Claridad**: El código refleja el dominio del negocio

## Tecnologías Utilizadas

- **NestJS**: Framework para Node.js
- **TypeORM**: ORM para base de datos
- **SQLite**: Base de datos para desarrollo
- **TypeScript**: Lenguaje de programación
- **UUID**: Generación de identificadores únicos

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar tests
npm test
``` 