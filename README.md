# 🚀 Inventory API

API REST desarrollada con NestJS y PostgreSQL para gestión de inventario.

## ❇️ Características Principales

- ✨ API RESTful con NestJS
- 🔐 Autenticación JWT
- 📊 Base de datos PostgreSQL con Sequelize
- 📝 Documentación con Swagger/OpenAPI
- 🔍 Filtrado, paginación y ordenamiento
- 🛡️ Roles y permisos
- 🐳 Dockerización completa

## 🔧 Requisitos Previos

- Node.js (v14 o superior)
- pnpm (gestor de paquetes)
- PostgreSQL
- Docker (opcional)

## ⚡ Inicio Rápido

1. **📂 Clonar el repositorio**

```bash
git clone https://github.com/usyeimar/backend-exam-nestjs-test-treda-solutions.git
cd inventory-api
```

2. **📦 Instalar dependencias**

```bash
pnpm install
```

3. **📝 Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con las configuraciones necesarias
```

4. **🚀 Iniciar en desarrollo**

```bash
pnpm start:dev
```

5. **🌐 Verificar instalación**

- API: http://localhost:3000
- Documentación Swagger: http://localhost:3000/docs
- Documentacion de Postman:https://documenter.getpostman.com/view/14969501/2sAYBYgqJN

### 🏃 Ejecutando con Docker

```sh
docker run -it --rm -p 3000:3000 \
  -e DB_URL=postgresql://backend_exam_nestjs_test_treda_solutions_user:MnXVowfAXhVLALE2B8dBU9DNhKvKuJkA@dpg-ct770fi3esus73bnkhg0-a.oregon-postgres.render.com/backend_exam_nestjs_test_treda_solutions \
  -e JWT_SECRET=myjwtsecret \
  -e JWT_EXPIRATION_TIME=3600s \
  usyeima/backend-exam-nestjs-test-treda-solutions
```

## 🗄️ Variables de Entorno

| Variable         | Descripción                        | Valor por defecto |
|------------------|------------------------------------|-------------------|
| `PORT`           | Puerto del servidor                | `3000`            |
| `DB_URL`         | URL de conexión a la base de datos | -                 |
| `DB_HOST`        | Host de la base de datos           | `localhost`       |
| `DB_PORT`        | Puerto de la base de datos         | `5432`            |
| `DB_USER`        | Usuario de la base de datos        | `postgres`        |
| `DB_PASSWORD`    | Contraseña de la base de datos     | -                 |
| `DB_NAME`        | Nombre de la base de datos         | `inventory_db`    |
| `JWT_SECRET`     | Secreto para tokens JWT            | -                 |
| `JWT_EXPIRATION` | Tiempo de expiración JWT           | `24h`             |
|                  |                                    |                   |

## 🛠️ Docker

### Desarrollo

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down
```

## 📚 Documentación API

### 🔐 Autenticación

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 🔑 Endpoints Principales

#### Productos

- `GET /api/v1/products` - Listar productos
    - Query params:
        - `search`: Búsqueda por nombre
        - `categoryId`: Filtrar por categoría
        - `minPrice`: Precio mínimo
        - `maxPrice`: Precio máximo
        - `page`: Número de página
        - `limit`: Items por página
        - `sortBy`: Campo de ordenamiento
        - `order`: Dirección del ordenamiento (ASC/DESC)

- `GET /api/v1/products/:id` - Obtener producto
- `POST /api/v1/products` - Crear producto (Admin)
- `PUT /api/v1/products/:id` - Actualizar producto (Admin)
- `DELETE /api/v1/products/:id` - Eliminar producto (Admin)

#### Categorías

- `GET /api/v1/categories` - Listar categorías
- `POST /api/v1/categories` - Crear categoría (Admin)

## 📁 Estructura del Proyecto

```
src/
├── modules/           # Módulos de la aplicación
│   ├── auth/         # Autenticación
│   ├── products/     # Gestión de productos
│   └── categories/   # Gestión de categorías
├── shared/           # Código compartido
│   ├── decorators/   # Decoradores personalizados
│   ├── guards/       # Guards de autenticación
│   └── utils/        # Utilidades comunes
└── config/           # Configuraciones
```

## 🧪 Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod

```

## 📝 Guías Adicionales

### Crear Nuevo Módulo

```bash
nest g module nuevo-modulo
nest g controller nuevo-modulo
nest g service nuevo-modulo
```

### Documentar con Swagger

```typescript

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(@Query() query: FilterProductsDto) {
    return this.productsService.findAll(query);
  }
}
```

## Preguntas de Questionario

### 1. ¿Qué significa que una API sea stateless?

Una API stateless significa que el servidor no mantiene ni almacena ningún estado del cliente entre peticiones

### 2. ¿Qué es el archivo package-lock.json y cuál es su propósito?

Es un archivo generado automáticamente por npm que registra las versiones exactas de todas las dependencias
instaladas

### 3. ¿Cuál es la diferencia entre los métodos HTTP PATCH y PUT en una API RESTful?

    - `PUT`: Se utiliza para actualizar un recurso completo. Si el recurso no existe, se crea uno nuevo.
    - `PATCH`: Se utiliza para actualizar parcialmente un recurso. Si el recurso no existe, se devuelve un error.

### 4. ¿Cuál es la diferencia entre un Callback, una Promise, y async/await en Node.js?

`Callbacks` son funciones que se pasan como argumentos a otras funciones y se ejecutan después de que se complete una
operación asincrónica.

`Promises` son objetos que representan el resultado de una operación asincrónica. Permiten encadenar operaciones y
manejar errores de forma más sencilla.

`async/await` es una forma más moderna de trabajar con promesas. Permite escribir código asincrónico de forma más clara
y
concisa.

```js
// Usando Callbacks
function obtenerDatosAPI(callback) {
  fetch('https://api.ejemplo.com/datos')
    .then(res => res.json())
    .then(data => callback(null, data))
    .catch(err => callback(err));
}

// Usando Promises
function obtenerDatosAPI() {
  return fetch('https://api.ejemplo.com/datos')
    .then(res => res.json());
}

// Usando Async/Await
async function obtenerDatosAPI() {
  try {
    const respuesta = await fetch('https://api.ejemplo.com/datos');
    return await respuesta.json();
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
}
```
