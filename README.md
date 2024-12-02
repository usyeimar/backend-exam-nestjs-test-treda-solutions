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

- Node.js (v18 o superior)
- pnpm (gestor de paquetes)
- PostgreSQL
- Docker (opcional)

## ⚡ Inicio Rápido

1. **📂 Clonar el repositorio**
```bash
git clone <url-repositorio>
cd inventory-api
```

2. **📦 Instalar dependencias**
```bash
pnpm install
```

3. **📝 Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **🚀 Iniciar en desarrollo**
```bash
pnpm start:dev
```

5. **🌐 Verificar instalación**
- API: http://localhost:3000
- Documentación: http://localhost:3000/docs

## 🗄️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `DB_NAME` | Nombre de la base de datos | `inventory_db` |
| `JWT_SECRET` | Secreto para tokens JWT | - |
| `JWT_EXPIRATION` | Tiempo de expiración JWT | `24h` |

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

### Producción
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentación API

### 🔐 Autenticación

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 🔑 Endpoints Principales

#### Productos
- `GET /products` - Listar productos
    - Query params:
        - `search`: Búsqueda por nombre
        - `categoryId`: Filtrar por categoría
        - `minPrice`: Precio mínimo
        - `maxPrice`: Precio máximo
        - `page`: Número de página
        - `limit`: Items por página
        - `sortBy`: Campo de ordenamiento
        - `order`: Dirección del ordenamiento (ASC/DESC)

- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto (Admin)
- `PUT /products/:id` - Actualizar producto (Admin)
- `DELETE /products/:id` - Eliminar producto (Admin)

#### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría (Admin)

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

# Tests
pnpm test          # unit tests
pnpm test:e2e      # end-to-end tests
pnpm test:cov      # test coverage

# Base de datos
pnpm seed          # poblar base de datos
pnpm seed:fresh    # limpiar y poblar
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

## 👥 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.