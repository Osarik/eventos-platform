# Eventos Platform

SaaS profesional para crear eventos, vender entradas, generar codigos QR y validar asistentes el dia del evento.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Supabase Auth, PostgreSQL y Storage
- React Hook Form + Zod
- TanStack Query
- Lucide Icons
- React QR Code
- html5-qrcode
- ESLint, Prettier, Husky y lint-staged

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENTS_SECRET=
WOMPI_INTEGRITY_SECRET=
```

Si Supabase no esta configurado, el middleware permite navegar localmente para revisar el sprint visual.

## Base de datos

El esquema inicial vive en:

```bash
supabase/migrations/001_initial_schema.sql
```

Incluye:

- `usuarios`
- `eventos`
- `compras`
- `tickets`
- `validaciones`
- enums de estado
- RLS base
- roles `admin`, `staff`, `customer`

## Sprint 1

Incluido:

- arquitectura modular
- landing
- catalogo de eventos
- detalle de evento
- checkout preparado para Wompi
- login con Supabase Auth
- dashboard administrativo
- CRUD visual de eventos
- listado de tickets con QR
- scanner QR preparado para Supabase
- configuracion profesional de calidad

Pendiente para siguientes sprints:

- CRUD persistente con Supabase
- subida real de imagenes a Supabase Storage
- integracion Wompi
- webhooks de pago
- envio de tickets por correo
- auditoria avanzada de validaciones

## Vercel

El proyecto esta listo para desplegar en Vercel. Configura las mismas variables de entorno del archivo `.env.example` en el panel del proyecto.
