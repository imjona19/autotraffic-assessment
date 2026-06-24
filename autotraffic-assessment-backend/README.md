# TaskAssessment — Backend

API REST para la gestión de tareas personales. Construida con Express, TypeScript y Prisma sobre PostgreSQL.

## Stack

- Node.js + Express 5
- TypeScript
- Prisma ORM + PostgreSQL (`@prisma/adapter-pg`)
- JWT (`jsonwebtoken`) para autenticación
- `bcrypt` para hash de contraseñas

## Requisitos previos

- Node.js 20+
- Una base de datos PostgreSQL (local o en la nube)

## Instalación y ejecución

```bash
npm install
cp .env.example .env        # completa las variables, ver tabla abajo
npx prisma migrate deploy   # aplica las migraciones a la base de datos
npm run dev                 # levanta el servidor con recarga automática
```

El servidor queda escuchando en `http://localhost:3001` (o el puerto que definas en `PORT`). Verifica que esté corriendo con:

```bash
curl http://localhost:3001/api/ping
# { "status": "ok", "message": "Pong" }
```

Para producción:

```bash
npm run build   # compila TypeScript a dist/
npm start       # aplica migraciones pendientes y levanta dist/server.js
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Sí | Secreto para firmar/verificar los JWT |
| `JWT_EXPIRES_IN` | No | Vigencia del token (por defecto `1d`) |
| `PORT` | No | Puerto del servidor (por defecto `3001`) |

## Modelo de datos

```
User
├─ id, name, email (único), password (hash), active
└─ created_at, updated_at

Task
├─ id, title, description, completed, order, active
├─ userId  →  pertenece a un User
└─ tags    →  relación N:M con Tag

Tag
├─ id, name, color
├─ userId  →  pertenece a un User
└─ (name, userId) es único — no se repiten nombres de etiqueta por usuario
```

Definido en [`prisma/schema.prisma`](./prisma/schema.prisma).

## API

Todas las rutas viven bajo el prefijo `/api`. Salvo `/api/ping` y `/api/auth/*`, todas requieren el header:

```
Authorization: Bearer <token>
```

El `userId` se extrae del token; cada operación queda automáticamente acotada al usuario autenticado.

### Auth

#### `POST /api/auth/register`

Crea un usuario nuevo.

```json
// Request
{ "name": "Jane Doe", "email": "jane@mail.com", "password": "secreta123" }

// 201 Created
{
  "message": "Usuario registrado con éxito",
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@mail.com", "active": true, "created_at": "...", "updated_at": "..." }
}
```

#### `POST /api/auth/login`

```json
// Request
{ "email": "jane@mail.com", "password": "secreta123" }

// 200 OK
{
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@mail.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

`401` si las credenciales son inválidas.

### Tasks

#### `GET /api/tasks`

Devuelve las tareas del usuario autenticado, ordenadas por `order` (incluye sus `tags`).

```json
// 200 OK
[
  {
    "id": 5,
    "title": "Diseñar mockups",
    "description": "Para la nueva funcionalidad",
    "completed": false,
    "order": 0,
    "created_at": "2026-06-20T10:00:00.000Z",
    "updated_at": "2026-06-20T10:00:00.000Z",
    "tags": [{ "id": 2, "name": "Diseño", "color": "#254bdc" }]
  }
]
```

#### `POST /api/tasks`

```json
// Request
{ "title": "Diseñar mockups", "description": "Para la nueva funcionalidad", "tagIds": [2] }
```

`title` es obligatorio (`400` si falta). `description` y `tagIds` son opcionales. Responde `201` con la tarea creada.

#### `PUT /api/tasks/:id`

Actualiza cualquier combinación de `title`, `description`, `completed`, `tagIds`. Requiere al menos un campo (`400` si no se envía ninguno). `404`/`400` si la tarea no existe o no pertenece al usuario.

```json
// Request
{ "completed": true }
```

#### `PUT /api/tasks/reorder`

Persiste el nuevo orden tras un drag & drop en el frontend.

```json
// Request
{ "orderedIds": [8, 5, 3, 9] }
```

Recalcula el campo `order` de cada tarea según su posición en el arreglo. `400` si algún id no pertenece al usuario.

#### `DELETE /api/tasks/:id`

```json
// 200 OK
{ "message": "Tarea eliminada correctamente" }
```

### Tags

| Método | Ruta | Body | Descripción |
|--------|------|------|--------------|
| GET | `/api/tags` | — | Lista las etiquetas del usuario (orden alfabético) |
| POST | `/api/tags` | `{ "name": "Urgente", "color": "#EF4444" }` | Crea una etiqueta (`color` opcional, por defecto `#254bdc`). `409` si el nombre ya existe para ese usuario |
| DELETE | `/api/tags/:id` | — | Elimina una etiqueta. `404` si no pertenece al usuario |

## Estructura del proyecto

```
src/
├── app.ts            # configuración de Express, montaje de rutas
├── server.ts         # punto de entrada, conexión a la base de datos
├── config/           # cliente de Prisma
├── routes/           # definición de endpoints por recurso
├── controllers/      # manejo de request/response
├── services/         # lógica de negocio y acceso a datos (Prisma)
└── middlewares/       # verificación de JWT
```
