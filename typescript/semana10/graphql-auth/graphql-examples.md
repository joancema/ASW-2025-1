# Ejemplos de GraphQL para Testing

## 1. Registro de Usuario

```graphql
mutation RegisterUser {
  register(input: {
    username: "juan_perez"
    email: "juan@example.com"
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

## 2. Login de Usuario

```graphql
mutation LoginUser {
  login(input: {
    username: "juan_perez"
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

## 3. Obtener Perfil del Usuario (Requiere Autenticación)

```graphql
query GetMyProfile {
  me {
    id
    username
    email
  }
}
```

**Headers requeridos para queries protegidas:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_TOKEN_HERE"
}
```

## Instrucciones de Prueba

1. **Iniciar el servidor:**
   ```bash
   npm run start:dev
   ```

2. **Abrir Apollo Studio:**
   Ir a http://localhost:3000/graphql

3. **Registrar un usuario:**
   - Ejecutar la mutation `RegisterUser`
   - Copiar el token devuelto

4. **Probar query protegida:**
   - En Apollo Studio, en la pestaña "Headers", agregar:
   ```json
   {
     "Authorization": "Bearer TOKEN_COPIADO_AQUI"
   }
   ```
   - Ejecutar la query `GetMyProfile`

5. **Probar login:**
   - Ejecutar la mutation `LoginUser` con las mismas credenciales

## Nota sobre Apollo Studio

El proyecto utiliza `ApolloServerPluginLandingPageLocalDefault()` que proporciona:
- ✅ **Interfaz moderna** - Mejor UX que el playground clásico
- ✅ **Exploración completa** del schema GraphQL
- ✅ **Autocompletado inteligente** para queries y mutations
- ✅ **Manejo fácil de headers** para autenticación

## Schema GraphQL Generado

El schema se genera automáticamente en `src/schema.gql` cuando ejecutas el servidor. 