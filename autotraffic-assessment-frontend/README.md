# TaskAssessment — Frontend

Interfaz web para la gestión de tareas personales. SPA construida con React, TypeScript y Vite, estilizada con Tailwind CSS.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router (rutas protegidas)
- Axios (cliente HTTP con interceptores)
- `@dnd-kit` (drag & drop para reordenar tareas)
- `react-hot-toast` (notificaciones)
- `lucide-react` (iconos)

## Requisitos previos

- Node.js 20+
- El [backend](../autotraffic-assessment-backend) corriendo y accesible (ver `VITE_API_URL`)

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend corre en otro host/puerto
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3001/api` |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Type-check + build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Corre ESLint sobre el proyecto |

## Características

- **Autenticación**: registro e inicio de sesión; el token JWT y el usuario se guardan en `localStorage` y se adjuntan automáticamente a cada request (`src/api/apiClient.ts`). Si el backend responde `401`, la sesión se limpia y se redirige a `/login`.
- **Rutas protegidas**: `/dashboard` solo es accesible con sesión activa (`src/router/ProtectedRoute.tsx`); cualquier ruta desconocida redirige a `/login`.
- **Gestión de tareas**: crear, editar, completar/pendiente y eliminar, con confirmación antes de borrar y notificaciones toast por cada acción.
- **Etiquetas**: asignar una o varias etiquetas con color a cada tarea, y crear etiquetas nuevas directamente desde el formulario.
- **Búsqueda y filtros**: por título y por estado (todas / pendientes / completadas).
- **Reordenamiento**: arrastrar y soltar tareas para definir su orden, persistido en el backend (deshabilitado mientras hay un filtro o búsqueda activa).
- **Estadísticas**: tarjetas con el total de tareas, pendientes y completadas.
- **Diseño responsivo**: layout con sidebar colapsable en móvil, pensado para escritorio y dispositivos móviles.

## Estructura del proyecto

```
src/
├── api/            # cliente Axios y llamadas a la API (auth, tasks, tags)
├── components/
│   ├── auth/       # formularios de login/registro
│   ├── dashboard/  # listado, formulario, item de tarea, stats, skeleton
│   ├── layout/      # sidebar, header, layout del dashboard
│   └── ui/          # componentes genéricos (input, modal de confirmación)
├── context/        # AuthContext (sesión del usuario)
├── hooks/          # useTasks, useTags
├── pages/          # Login, Register, Dashboard
├── router/         # definición de rutas y ProtectedRoute
├── types/          # tipos compartidos (Task, Tag, User)
└── utils/          # helpers (formato de fechas)
```
