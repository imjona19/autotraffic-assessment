# TaskAssessment

Aplicación full-stack de gestión de tareas personales. Permite crear, ver, actualizar y eliminar tareas, con autenticación de usuarios, etiquetas, búsqueda/filtros y reordenamiento por drag & drop.

Proyecto desarrollado como solución al assessment técnico "Aplicación de Gestión de Tareas".

## Tabla de contenidos

- [Demo](#demo)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [Variables de entorno](#variables-de-entorno)
- [API](#api)
- [Cómo funciona el sistema](#cómo-funciona-el-sistema)
- [Scripts disponibles](#scripts-disponibles)

## Demo

| Entorno  | URL |
|----------|-----|
| Frontend | [https://task-assessment-lyart.vercel.app](https://task-assessment-lyart.vercel.app) |
| Backend  | [https://autotraffic-assessment-backend.onrender.com](https://autotraffic-assessment-backend.onrender.com) |

> El backend está en el plan free de Render: si lleva más de 15 minutos sin tráfico, el primer request puede tardar 30-50s en responder mientras el servicio "despierta".

## Credenciales de prueba

| Email | Contraseña |
|-------|------------|
| `jona@jona` | `admin01` |

> También puedes registrar tu propia cuenta desde la pantalla de registro.

## Características

**Requerimientos mínimos**

- Crear una nueva tarea (título obligatorio, descripción opcional).
- Ver todas las tareas existentes.
- Marcar una tarea como completada o pendiente.
- Eliminar una tarea.
- API REST (`GET/POST/PUT/DELETE /tasks`) con el formato de datos solicitado (`id`, `title`, `description`, `completed`, `created_at`, `updated_at`).
- Interfaz responsiva (escritorio y móvil).

**Extras**

- Autenticación de usuarios (registro / login) con JWT — cada usuario solo ve y gestiona sus propias tareas.
- Etiquetas (tags) por color, asociables a varias tareas.
- Búsqueda por título y filtro por estado (todas / pendientes / completadas).
- Reordenamiento manual de tareas por drag & drop (persistido en base de datos).
- Estadísticas rápidas (total, pendientes, completadas) en el dashboard.
- Notificaciones toast para cada acción (crear, editar, eliminar, error de red).
- Borrado lógico de tareas (`active`) y soft-validation por usuario en cada operación.

## Stack tecnológico

| Capa     | Tecnologías |
|----------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios, `@dnd-kit` (drag & drop), `react-hot-toast`, `lucide-react` |
| Backend  | Node.js, Express 5, TypeScript, Prisma ORM, PostgreSQL, JWT (`jsonwebtoken`), `bcrypt` |

## Estructura del repositorio

```
autotraffic-assessment/
├── autotraffic-assessment-backend/   # API REST (Express + Prisma + PostgreSQL)
└── autotraffic-assessment-frontend/  # SPA (React + Vite + Tailwind)
```

Cada paquete tiene su propio README con detalle de instalación y configuración:

- [autotraffic-assessment-backend/README.md](./autotraffic-assessment-backend/README.md)
- [autotraffic-assessment-frontend/README.md](./autotraffic-assessment-frontend/README.md)

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- [PostgreSQL](https://www.postgresql.org/) 14 o superior (local o en la nube, p. ej. [Neon](https://neon.tech) o [Supabase](https://supabase.com))
- npm (incluido con Node.js)

## Puesta en marcha local

Clona el repositorio:

```bash
git clone https://github.com/imjona19/autotraffic-assessment.git
cd autotraffic-assessment
```

### 1. Backend

```bash
cd autotraffic-assessment-backend
npm install
cp .env.example .env   # completa DATABASE_URL y JWT_SECRET, ver tabla de abajo
npx prisma migrate deploy
npm run dev
```

El backend queda disponible en `http://localhost:3001` (verifica con `GET /api/ping`).

### 2. Frontend

En otra terminal:

```bash
cd autotraffic-assessment-frontend
npm install
cp .env.example .env   # ajusta VITE_API_URL si tu backend corre en otro puerto
npm run dev
```

El frontend queda disponible en `http://localhost:5173`. Abre esa URL, regístrate y empieza a crear tareas.

## Variables de entorno

**Backend** (`autotraffic-assessment-backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/taskassessment` |
| `JWT_SECRET` | Secreto usado para firmar los tokens JWT | `una-cadena-larga-y-aleatoria` |
| `JWT_EXPIRES_IN` | Vigencia del token (opcional, por defecto `1d`) | `1d` |
| `PORT` | Puerto del servidor (opcional, por defecto `3001`) | `3001` |

**Frontend** (`autotraffic-assessment-frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API consumida por el cliente | `http://localhost:3001/api` |

## API

Todas las rutas (excepto `/api/auth/*` y `/api/ping`) requieren el header `Authorization: Bearer <token>` obtenido al iniciar sesión.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crea un usuario |
| POST | `/api/auth/login` | Inicia sesión, devuelve `{ user, token }` |
| GET | `/api/tasks` | Lista las tareas del usuario autenticado |
| POST | `/api/tasks` | Crea una tarea (`title` obligatorio, `description` opcional) |
| PUT | `/api/tasks/:id` | Actualiza `title`, `description` y/o `completed` |
| PUT | `/api/tasks/reorder` | Persiste el nuevo orden tras un drag & drop |
| DELETE | `/api/tasks/:id` | Elimina una tarea |
| GET | `/api/tags` | Lista las etiquetas del usuario |
| POST | `/api/tags` | Crea una etiqueta (`name`, `color`) |
| DELETE | `/api/tags/:id` | Elimina una etiqueta |

Documentación completa con ejemplos de request/response en el [README del backend](./autotraffic-assessment-backend/README.md#api).

## Cómo funciona el sistema

1. El **frontend** (SPA en React) gestiona el estado de la sesión en `localStorage` (token JWT + datos del usuario) y lo adjunta automáticamente a cada request vía un interceptor de Axios (`src/api/apiClient.ts`). Si una respuesta llega con `401`, limpia la sesión y redirige a `/login`.
2. El **backend** expone una API REST protegida con un middleware (`verifyToken`) que valida el JWT y resuelve el `userId` de la petición; cada consulta a la base de datos se filtra por ese `userId`, por lo que un usuario nunca puede ver ni modificar tareas de otro.
3. Las tareas se persisten en **PostgreSQL** vía **Prisma**. Cada tarea tiene un campo `order` que determina su posición; al soltar una tarea tras arrastrarla, el frontend recalcula el arreglo localmente (optimista) y envía el nuevo orden a `PUT /tasks/reorder`, que actualiza todos los registros en una transacción.
4. Las contraseñas se almacenan con hash (`bcrypt`); el login compara el hash y, si es válido, firma un JWT (`jsonwebtoken`) que el cliente reutiliza en cada request.

## Scripts disponibles

**Backend**

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Aplica migraciones pendientes y levanta el servidor compilado (uso en producción) |

**Frontend**

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor de desarrollo de Vite |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Corre ESLint sobre el proyecto |

