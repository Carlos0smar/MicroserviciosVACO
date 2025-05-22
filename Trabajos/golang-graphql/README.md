# API GraphQL con Autenticación JWT

Esta API implementa un sistema de gestión de libros con autenticación JWT. Solo los usuarios con rol de administrador pueden crear, editar y eliminar libros, mientras que cualquier usuario puede consultar la información de los libros.

## Requisitos

- Go 1.24 o superior
- MongoDB

## Configuración

1. Asegúrate de tener MongoDB ejecutándose en `localhost:27017`
2. Clona este repositorio
3. Ejecuta `go mod tidy` para instalar las dependencias

## Inicialización

Para crear un usuario administrador por defecto, ejecuta:

```bash
go run scripts/init_admin.go
```

Esto creará un usuario administrador con las siguientes credenciales:
- Usuario: admin
- Contraseña: admin123

## Ejecución

Para iniciar el servidor:

```bash
go run main.go
```

El servidor se iniciará en `http://localhost:8080`

## Endpoints

- `/graphql` - Endpoint principal para consultas y mutaciones GraphQL
- `/health` - Endpoint para verificar el estado del servidor

## Autenticación

### Registro de usuario

```graphql
mutation {
  register(input: {
    username: "nuevoUsuario",
    password: "contraseña",
    role: "admin"  # o "user" para usuarios normales
  }) {
    id
    username
    role
  }
}
```

### Inicio de sesión

```graphql
mutation {
  login(username: "admin", password: "admin123") {
    token
    user {
      id
      username
      role
    }
  }
}
```

El token JWT devuelto debe incluirse en las solicitudes posteriores en el encabezado `Authorization`:

```
Authorization: Bearer <token>
```

## Operaciones con libros

### Consultar todos los libros (no requiere autenticación)

```graphql
query {
  books {
    id
    titulo
    autor
    editorial
    anio
    descripcion
    numero_pagina
  }
}
```

### Consultar un libro por ID (no requiere autenticación)

```graphql
query {
  book(id: "id_del_libro") {
    id
    titulo
    autor
    editorial
    anio
    descripcion
    numero_pagina
  }
}
```

### Crear un libro (requiere rol de administrador)

```graphql
mutation {
  createBook(input: {
    titulo: "Nuevo Libro",
    autor: "Autor",
    editorial: "Editorial",
    anio: 2023,
    descripcion: "Descripción del libro",
    numero_pagina: 200
  }) {
    id
    titulo
    autor
  }
}
```

### Actualizar un libro (requiere rol de administrador)

```graphql
mutation {
  updateBook(
    id: "id_del_libro",
    input: {
      titulo: "Título Actualizado",
      autor: "Autor Actualizado",
      editorial: "Editorial",
      anio: 2023,
      descripcion: "Descripción actualizada",
      numero_pagina: 200
    }
  ) {
    id
    titulo
    autor
  }
}
```

### Eliminar un libro (requiere rol de administrador)

```graphql
mutation {
  deleteBook(id: "id_del_libro") {
    success
    message
  }
}
```
