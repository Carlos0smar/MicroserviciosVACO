# Servicio de Autenticación en Go

Este servicio proporciona autenticación y autorización de usuarios mediante JWT (JSON Web Tokens). Permite registrar usuarios, iniciar sesión y verificar la autorización basada en roles.

## Funcionalidades

- Registro de usuarios
- Inicio de sesión con generación de JWT
- Validación de tokens JWT
- Control de acceso basado en roles
- Perfil de usuario

## Requisitos

- Go 1.16 o superior
- MySQL 5.7 o superior

## Configuración

1. Crea una base de datos MySQL llamada `auth_db`
2. Configura las variables de entorno en el archivo `.env`:

```
DB_USER=root
DB_PASS=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_NAME=auth_db
API_PORT=8080
JWT_SECRET=tu_clave_secreta
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

```
go mod download
```

3. Ejecuta la aplicación:

```
go run main.go
```

El servidor estará disponible en `http://localhost:8080`

## Endpoints

### Público

- `POST /api/register` - Registro de nuevos usuarios
  ```json
  {
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }
  ```

- `POST /api/login` - Inicio de sesión
  ```json
  {
    "username": "usuario",
    "password": "contraseña"
  }
  ```

### Protegido (requiere token JWT)

- `GET /api/profile` - Obtiene el perfil del usuario actual

## Uso del token JWT

Para acceder a endpoints protegidos, incluye el token JWT en el encabezado de autorización:

```
Authorization: Bearer tu_token_jwt
```

## Contenido del token JWT

El token JWT contiene la siguiente información:

- ID del usuario
- Nombre de usuario
- Rol del usuario
- Tiempo de expiración

## Estructura del proyecto

- `config/`: Configuración de la aplicación
- `controllers/`: Controladores para manejar las solicitudes
- `db/`: Conexión y operaciones de base de datos
- `middleware/`: Middleware para autenticación y autorización
- `models/`: Modelos de datos
- `routes/`: Definición de rutas del API
