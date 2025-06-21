# Guía de Uso de Tokens JWT en GraphQL

## 🔑 Obtener el Token

Primero necesitas obtener un token mediante registro o login:

### Registro:
```graphql
mutation {
  register(input: {
    username: "testuser"
    email: "test@example.com"
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

### Login:
```graphql
mutation {
  login(input: {
    username: "testuser"
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

**⚠️ Importante:** Copia el `token` de la respuesta.

---

## 🌐 Usar el Token en Apollo Studio

### Paso 1: Abrir Apollo Studio
Ir a: http://localhost:3000/graphql

### Paso 2: Configurar Headers
En la parte inferior de Apollo Studio, busca la sección **"Headers"** y agrega:

```json
{
  "Authorization": "Bearer tu_token_aqui"
}
```

**Ejemplo completo:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwic3ViIjoxLCJpYXQiOjE3MDEyNzU2MzQsImV4cCI6MTcwMTM2MjAzNH0.abc123def456"
}
```

### Paso 3: Ejecutar Query Protegida
```graphql
query {
  me {
    id
    username
    email
  }
}
```

---

## 📡 Usar el Token con cURL

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_aqui" \
  -d '{
    "query": "query { me { id username email } }"
  }'
```

---

## 🔧 Usar el Token con JavaScript/TypeScript

### Con fetch:
```javascript
const token = "tu_token_aqui";

const response = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: `
      query {
        me {
          id
          username
          email
        }
      }
    `
  })
});

const data = await response.json();
console.log(data);
```

### Con Apollo Client:
```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

---

## ❌ Errores Comunes

### Error: "Unauthorized" o "Access denied"
**Causa:** Token no incluido o inválido
**Solución:** 
1. Verifica que incluyes `Bearer ` antes del token
2. Asegúrate de que el token no haya expirado (24h por defecto)
3. Verifica que el header se llame exactamente `Authorization`

### Error: "Invalid token format"
**Causa:** Token malformado
**Solución:**
1. El token debe tener 3 partes separadas por puntos (JWT)
2. No incluyas espacios extra
3. Copia el token completo desde la respuesta

### Error: "Token expired"
**Causa:** El token ha expirado
**Solución:**
1. Haz login nuevamente para obtener un token fresco
2. Los tokens expiran en 24 horas por defecto

---

## 🔒 Formato Correcto del Header

✅ **Correcto:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

❌ **Incorrecto:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Falta "Bearer "
authorization: Bearer token...                           # Minúscula
Auth: Bearer token...                                    # Nombre incorrecto
```

---

## 🧪 Ejemplo Completo Paso a Paso

### 1. Registro
```graphql
mutation Register {
  register(input: {
    username: "johndoe"
    email: "john@example.com"
    password: "mypassword123"
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

**Respuesta:**
```json
{
  "data": {
    "register": {
      "user": {
        "id": "1",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJzdWIiOjEsImlhdCI6MTcwMTI3NTYzNCwiZXhwIjoxNzAxMzYyMDM0fQ.K7bA9gF2jH8mN3pQ4rS5tU6vW7xY8zA9bC0dE1fG2hI"
    }
  }
}
```

### 2. Configurar Header
En Apollo Studio, en la sección Headers:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJzdWIiOjEsImlhdCI6MTcwMTI3NTYzNCwiZXhwIjoxNzAxMzYyMDM0fQ.K7bA9gF2jH8mN3pQ4rS5tU6vW7xY8zA9bC0dE1fG2hI"
}
```

### 3. Consultar Perfil
```graphql
query GetProfile {
  me {
    id
    username
    email
  }
}
```

**Respuesta exitosa:**
```json
{
  "data": {
    "me": {
      "id": "1",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
``` 