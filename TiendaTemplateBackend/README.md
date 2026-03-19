# TiendaTemplateBackend

API REST para e-commerce construida con Spring Boot siguiendo arquitectura hexagonal (Clean Architecture). Incluye autenticación JWT, gestión de productos con variantes, y sistema de pedidos.

---

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.2.4 |
| Spring Security | 6.x (incluido en Boot 3.2.4) |
| Spring Data JPA | 3.2.4 |
| PostgreSQL | 15 |
| JWT (jjwt) | 0.12.5 |
| MapStruct | 1.5.5.Final |
| Lombok | 1.18.38 |
| Maven | 3.x |
| Docker / Docker Compose | - |

---

## Arquitectura

El proyecto sigue **arquitectura hexagonal** dividida en tres capas:

```
com.backend.TiendaTemplateBackend
├── domain/                        # Núcleo del negocio (sin dependencias externas)
│   ├── model/                     # Entidades de dominio
│   └── repository/                # Interfaces de repositorio (puertos)
├── application/                   # Casos de uso y lógica de aplicación
│   ├── dto/                       # Objetos de transferencia de datos
│   ├── mapper/                    # Mapeo dominio ↔ DTO (MapStruct)
│   ├── services/                  # Servicios de soporte (UserDetails)
│   └── usecases/                  # Un caso de uso por clase
└── infrastructure/                # Adaptadores externos
    ├── config/                    # Inicialización de datos
    ├── persistence/               # Implementaciones JPA de repositorios
    │   ├── entities/              # Entidades JPA
    │   └── jpa/                   # Interfaces Spring Data JPA
    ├── rest/                      # Controladores REST
    │   └── advice/                # Manejo global de excepciones
    └── security/                  # JWT, filtros y configuración de seguridad
```

---

## Requisitos previos

- Java 21+
- Maven 3.x
- Docker y Docker Compose (para la base de datos)

---

## Configuración y arranque

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd TiendaTemplateBackend
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edita `application.properties`:

```properties
spring.application.name=TiendaTemplateBackend

# JWT — usa una clave segura de mínimo 256 bits
jwt.secret=TU_CLAVE_SECRETA_AQUI
jwt.expiration=86400000

# Base de datos PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5433/TiendaTemplate
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.globally_quoted_identifiers=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

> **Nunca subas `application.properties` con credenciales reales a un repositorio público.**

### 3. Levantar la base de datos con Docker

```bash
docker compose up -d
```

Esto levanta PostgreSQL 15 en el puerto `5433`.

### 4. Compilar y ejecutar

```bash
mvn spring-boot:run
```

O bien compila el JAR y ejecútalo:

```bash
mvn clean package -DskipTests
java -jar target/TiendaTemplateBackend-0.0.1-SNAPSHOT.jar
```

La API queda disponible en `http://localhost:8080`.

---

## API Reference

### Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

El token se obtiene en el endpoint de login.

---

### Auth — `/api/auth`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario | Público |
| POST | `/api/auth/login` | Login y obtención de JWT | Público |
| POST | `/api/auth/register-admin` | Registrar administrador | ADMIN |

**Body register/login:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Response login:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "usuario@ejemplo.com"
}
```

---

### Productos — `/api/products`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/products` | Listar todos los productos | USER, ADMIN |
| GET | `/api/products/{id}` | Obtener producto por ID | USER, ADMIN |
| POST | `/api/products` | Crear producto | ADMIN |
| PUT | `/api/products/{id}` | Actualizar producto | ADMIN |
| DELETE | `/api/products/{id}` | Eliminar producto | ADMIN |

**Body crear/actualizar producto:**
```json
{
  "name": "Camiseta Básica",
  "description": "Camiseta de algodón",
  "basePrice": 19.99,
  "variants": [
    {
      "sku": "CAM-AZUL-L",
      "color": "Azul",
      "size": "L",
      "stock": 50,
      "priceOverride": null
    }
  ]
}
```

---

### Pedidos — `/api/orders`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/orders` | Crear pedido | Autenticado |
| GET | `/api/orders` | Listar todos los pedidos | Autenticado |
| GET | `/api/orders/seguimiento/{numeroPedido}` | Buscar por número de pedido | Autenticado |
| DELETE | `/api/orders/{id}` | Eliminar pedido | Autenticado |

**Body crear pedido:**
```json
{
  "shippingAddress": "Calle Mayor 1, Madrid",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

> El `numeroPedido` se genera automáticamente con formato `yyyyMMddXXXXX` (fecha + 5 dígitos aleatorios).

---

## Seguridad

- Autenticación mediante **JWT** (sin estado, STATELESS)
- Contraseñas hasheadas con **BCrypt**
- Roles: `ROLE_USER`, `ROLE_ADMIN` (inicializados automáticamente al arrancar)
- CORS configurado para: `http://localhost:5173` (Vite), `http://localhost:3000` (React), `http://localhost:4200` (Angular)

---

## Modelos de dominio

```
User           ←→ Role           (ManyToMany)
Order          →  User           (ManyToOne)
Order          →  OrderItem[]    (OneToMany)
OrderItem      →  Product        (ManyToOne)
Product        →  ProductVariant[] (OneToMany)
```

---

## Manejo de errores

| Excepción | Código HTTP |
|---|---|
| `RuntimeException` | 404 Not Found |
| `MethodArgumentNotValidException` | 400 Bad Request |
| `Exception` genérica | 500 Internal Server Error |

---

## Docker Compose

```yaml
# Levanta PostgreSQL 15 en puerto 5433
docker compose up -d

# Parar y eliminar contenedores
docker compose down

# Eliminar también el volumen de datos
docker compose down -v
```

---

## Estructura de archivos importante

```
TiendaTemplateBackend/
├── docker-compose.yml
├── pom.xml
└── src/
    └── main/
        └── resources/
            ├── application.properties          # NO subir con credenciales
            └── application.properties.example  # Plantilla se[mvnw](mvnw)gura para el repo
```