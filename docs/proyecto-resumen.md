# Eventos Platform — Resumen del Proyecto

## Visión General

SaaS de boletería para eventos en Colombia. Multi-tenant (una
suscripción, múltiples organizaciones), pagos con ePayco, entradas con
código QR, escáner para validación en puerta.

Stack: Next.js 15 (App Router) + TypeScript + Supabase (Auth + DB) +
Tailwind CSS + shadcn/ui. Desplegado en Vercel.

---

## Lo que está funcionando

### Landing page con doble cara

- **Visitante anónimo** → Hero público ("Descubre eventos", lista de
  eventos, call-to-action a /eventos)
- **Admin logueado** → Dashboard con stats (eventos activos, capacidad
  total, tickets emitidos) y accesos directos a Eventos, Tickets, Ventas,
  Scanner QR, Configuración

### Catálogo de eventos públicos

- `/eventos` — lista con todas las tarjetas de evento
- `/eventos/[slug]` — detalle con descripción, fecha, precio, botón
  "Comprar entrada"

### Flujo de compra (demo ePayco)

```
/eventos/[slug] → /checkout/[eventId] (formulario + resumen)
→ /checkout/[eventId]/payment (simulación ePayco Davivienda)
→ /checkout/[eventId]/success (tickets con QR generados)
```

- Formulario: nombre, email, teléfono, cantidad
- Pago simulado: selección de método (Tarjeta/PSE/Nequi/Daviplata)
- Tarjeta de prueba: `4575 6231 8229 0326` | Vence `12/25` | CVC `123`
- Éxito: muestra N entradas con código QR único cada una

### Scanner QR

- `/scanner` — cámara lee el token del QR, valida contra BD
- Puerto lógico para conectar con validación real

### Panel admin

- `/dashboard` — home con tarjetas de stats
- `/dashboard/eventos` — CRUD de eventos (pendiente conectar BD real)
- `/dashboard/tickets` — listado de entradas vendidas
- `/dashboard/ventas` — reportes de ventas
- `/dashboard/configuracion` — settings de la plataforma

### Autenticación

- Supabase Auth (email + password)
- Usuario admin creado: `admin@eventos.com` / `Admin123!`
- Middleware protege `/dashboard/*` y `/scanner`
- Login en `/login`

### Webhook ePayco

- `POST /api/webhook/epayco` — endpoint listo para recibir
  confirmaciones de pago

---

## Arquitectura

### Feature-based (dominios en src/features/)

```
src/features/
├── analytics/         # tipos
├── auth/              # componentes (login-form), servicios
├── dashboard/         # componentes (admin-shell, stat-card), tipos
├── events/            # componentes (event-card, event-form, events-table)
│                      # hooks (use-events), servicios (repositorio mock),
│                      # tipos, validadores
├── logs/              # servicios, tipos
├── organizations/     # hooks, servicios (repositorio mock), tipos
├── payments/          # componentes (checkout-form)
│                      # servicios (epayco-provider, wompi-provider,
│                      #   payment-provider)
│                      # tipos, validadores
├── scanner/           # componentes (qr-scanner), hooks, servicios, tipos
├── settings/          # tipos
└── tickets/           # componentes (tickets-table)
                       # servicios (repositorio mock), tipos
```

### Patrón repositorio (mock → real)

Cada dominio tiene:

- Interfaz (event-repository.ts)
- Implementación mock (event-mock-repository.ts)
- Los datos mock están dentro del mismo repositorio

### Sistema de pagos abstracto

```
PaymentProviderInterface
├── EpaycoProvider (demo + real con SDK)
└── WompiProvider (placeholder, "sprint posterior")

registerProvider() / getProvider() — registry pattern
```

### Base de datos (Supabase PostgreSQL)

Migraciones en `supabase/migrations/`:

- `001_initial_schema.sql` — tablas base: usuarios, eventos, compras,
  tickets, validaciones
- `002_multi_org_and_infra.sql` — organizations, organization_users,
  payments, scans, logs, secure tokens para QR, RLS multi-tenant,
  super_admin role

---

## Variables de Entorno

```env
NEXT_PUBLIC_APP_URL=https://eventos-platform-five.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<tu-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# ePayco (opcional — sin ellas funciona en demo mode)
NEXT_PUBLIC_EPAYCO_PUBLIC_KEY=
EPAYCO_PRIVATE_KEY=
```

---

## Deploy

- Producción: https://eventos-platform-five.vercel.app

---

## Próximos pasos / Cosas por hacer

### Corto plazo

- [ ] Conectar dashboard a BD real (reemplazar mock repositories con
      consultas a Supabase)
- [ ] CRUD completo de eventos (crear, editar, publicar desde el panel)
- [ ] Vista de tickets por evento con detalle de comprador
- [ ] Página de ventas con gráficos y filtros por fecha
- [ ] Logout funcional (actualmente no hay botón de cerrar sesión)
- [ ] Que la landing detecte bien la sesión del admin (puede fallar si
      la cookie no se lee correctamente)

### Mediano plazo

- [ ] Integrar ePayco real (agregar las API keys en Vercel)
- [ ] Migrar datos mock a Supabase (eventos de ejemplo en la BD)
- [ ] Role-based UI (diferenciar super_admin vs admin vs staff)
- [ ] Invitar miembros a la organización
- [ ] Página de configuración de organización (logo, colores, email)
- [ ] Tests automatizados

### Largo plazo

- [ ] Multi-tenant completo (cada organización ve solo sus eventos)
- [ ] Email templates personalizados (confirmación de compra,
      bienvenida)
- [ ] Reportes exportables (PDF/CSV)
- [ ] App móvil para escáner offline
- [ ] Integración con Nequi/Daviplata real

---

## Decisiones técnicas importantes

1. **ePayco elegida sobre Wompi** porque: no necesita cuenta
   Bancolombia, SDK Node.js oficial, soporte local WhatsApp, split de
   pagos nativo, plan agregador sin mensualidad
2. **Mock repositories primero** — permite desarrollar y demostrar sin
   BD, migrar a Supabase después reemplazando la implementación
3. **Feature-based sobre layers** — cada dominio (events, payments,
   tickets) contiene todo lo suyo: componentes, servicios, tipos. Más
   escalable que la estructura tradicional pages/components/services
4. **Server components por defecto** — solo "use client" cuando hay
   interactividad (forms, scanner, botones). Mejor performance
