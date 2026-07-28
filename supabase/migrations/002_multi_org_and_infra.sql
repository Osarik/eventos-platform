-- ============================================================================
-- Migration 002: Multi-organización, roles extendidos, auditoría, pagos
-- ============================================================================
-- Este migration prepara la plataforma para operar como SaaS multi-tenant.
-- Agrega: organizations, organization_users, payments, scans, logs,
--         secure tokens para QR, y extiende eventos con más campos.
-- ============================================================================

-- 1. EXTENDER ENUM DE ROLES
-- Se agrega 'super_admin' al enum existente
alter type public.user_role add value 'super_admin' before 'admin';

-- 2. TABLA: organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_path text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. TABLA: organization_users (relación N:N con roles por organización)
create table public.organization_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.usuarios(id) on delete cascade,
  role public.user_role not null default 'customer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

-- 4. AGREGAR organization_id A eventos
alter table public.eventos
  add column organization_id uuid references public.organizations(id) on delete set null,
  add column category text,
  add column gallery jsonb default '[]'::jsonb,
  add column ends_at timestamptz,
  add column cover_image_path text;

-- 5. AGREGAR secure_token A tickets
alter table public.tickets
  add column secure_token text not null default encode(gen_random_bytes(32), 'hex'),
  add column token_salt text not null default encode(gen_random_bytes(16), 'hex'),
  add column purchase_id uuid references public.compras(id) on delete set null;

-- 5b: Crear índice único en secure_token para búsquedas rápidas
create unique index idx_tickets_secure_token on public.tickets(secure_token);

-- 6. TABLA: payments (abstracta, multi-provider)
create type public.payment_provider as enum ('wompi', 'mercadopago', 'epayco', 'stripe');
create type public.payment_status as enum ('pending', 'processing', 'approved', 'declined', 'voided', 'error');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.compras(id) on delete cascade,
  provider public.payment_provider not null,
  provider_transaction_id text,
  provider_status text,
  amount_cop integer not null check (amount_cop >= 0),
  status public.payment_status not null default 'pending',
  request_payload jsonb,
  response_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. TABLA: scans (log detallado de validaciones físicas)
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  event_id uuid not null references public.eventos(id) on delete cascade,
  scanned_by uuid references public.usuarios(id) on delete set null,
  device_info jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  location text,
  result public.validation_result not null,
  reason text,
  scanned_at timestamptz not null default now()
);

-- 8. TABLA: logs (auditoría de acciones importantes)
create type public.log_action as enum (
  'event.created',
  'event.updated',
  'event.deleted',
  'event.published',
  'event.paused',
  'ticket.validated',
  'ticket.rejected',
  'purchase.completed',
  'payment.approved',
  'payment.declined',
  'payment.refunded',
  'user.invited',
  'user.removed',
  'organization.created',
  'organization.updated',
  'settings.updated'
);

create table public.logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_id uuid references public.usuarios(id) on delete set null,
  action public.log_action not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Índice para consultas rápidas de logs por organización
create index idx_logs_organization on public.logs(organization_id, created_at desc);

-- 9. TABLA: organization_settings
create table public.organization_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade unique,
  support_email text,
  support_phone text,
  ticket_prefix text default 'TKT',
  currency text default 'COP',
  timezone text default 'America/Bogota',
  primary_color text default '#000000',
  logo_url text,
  favicon_url text,
  email_config jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. FUNCIÓN: generar token seguro para QR
create or replace function public.generate_secure_token()
returns text
language sql
as $$
  select encode(gen_random_bytes(32), 'hex')
$$;

-- 11. FUNCIÓN: verificar slug único por organización
create or replace function public.is_slug_available(check_slug text, org_id uuid)
returns boolean
language sql
stable
as $$
  select not exists (
    select 1 from public.eventos
    where slug = check_slug
      and (organization_id = org_id or organization_id is null)
  )
$$;

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

-- Función helper: obtener organización del usuario actual
create or replace function public.current_user_organizations()
returns table(org_id uuid, user_role public.user_role)
language sql
stable
security definer
set search_path = public
as $$
  select ou.organization_id, ou.role
  from public.organization_users ou
  where ou.user_id = auth.uid()
    and ou.is_active = true
$$;

-- Función helper: verificar si usuario pertenece a una organización
create or replace function public.user_belongs_to_org(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_users ou
    where ou.user_id = auth.uid()
      and ou.organization_id = org_id
      and ou.is_active = true
  )
$$;

-- Función helper: verificar rol en organización
create or replace function public.user_org_role(org_id uuid)
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select ou.role
  from public.organization_users ou
  where ou.user_id = auth.uid()
    and ou.organization_id = org_id
    and ou.is_active = true
$$;

-- Habilitar RLS en tablas nuevas
alter table public.organizations enable row level security;
alter table public.organization_users enable row level security;
alter table public.payments enable row level security;
alter table public.scans enable row level security;
alter table public.logs enable row level security;
alter table public.organization_settings enable row level security;

-- POLICIES: organizations
-- Super admin puede ver/administrar todas
-- Usuarios pueden ver las organizaciones a las que pertenecen
create policy "org_select_members_and_superadmin"
  on public.organizations for select
  using (
    public.current_user_role() = 'super_admin'
    or public.user_belongs_to_org(id)
  );

create policy "org_insert_superadmin"
  on public.organizations for insert
  with check (public.current_user_role() = 'super_admin');

create policy "org_update_admin_or_superadmin"
  on public.organizations for update
  using (
    public.current_user_role() = 'super_admin'
    or public.user_org_role(id) in ('admin', 'super_admin')
  );

create policy "org_delete_superadmin"
  on public.organizations for delete
  using (public.current_user_role() = 'super_admin');

-- POLICIES: organization_users
create policy "org_users_select_members"
  on public.organization_users for select
  using (
    public.current_user_role() = 'super_admin'
    or user_id = auth.uid()
    or public.user_org_role(organization_id) in ('admin', 'super_admin')
  );

create policy "org_users_insert_admin"
  on public.organization_users for insert
  with check (
    public.current_user_role() = 'super_admin'
    or public.user_org_role(organization_id) in ('admin', 'super_admin')
  );

create policy "org_users_update_admin"
  on public.organization_users for update
  using (
    public.current_user_role() = 'super_admin'
    or public.user_org_role(organization_id) in ('admin', 'super_admin')
  );

create policy "org_users_delete_admin"
  on public.organization_users for delete
  using (
    public.current_user_role() = 'super_admin'
    or public.user_org_role(organization_id) in ('admin', 'super_admin')
  );

-- POLICIES: eventos (extender las existentes)
-- Remover políticas antiguas de eventos y crear nuevas con soporte multi-org
drop policy if exists "public can read active events" on public.eventos;
drop policy if exists "admins can manage events" on public.eventos;

create policy "eventos_select_public_active"
  on public.eventos for select
  using (status = 'active');

create policy "eventos_select_org_members"
  on public.eventos for select
  using (
    public.current_user_role() = 'super_admin'
    or (
      organization_id is not null
      and public.user_belongs_to_org(organization_id)
    )
    or owner_id = auth.uid()
  );

create policy "eventos_insert_org_members"
  on public.eventos for insert
  with check (
    public.current_user_role() = 'super_admin'
    or (
      organization_id is not null
      and public.user_org_role(organization_id) in ('admin', 'staff')
    )
  );

create policy "eventos_update_org_members"
  on public.eventos for update
  using (
    public.current_user_role() = 'super_admin'
    or (
      organization_id is not null
      and public.user_org_role(organization_id) in ('admin', 'staff')
    )
    or owner_id = auth.uid()
  );

create policy "eventos_delete_admin"
  on public.eventos for delete
  using (
    public.current_user_role() = 'super_admin'
    or (
      organization_id is not null
      and public.user_org_role(organization_id) = 'admin'
    )
  );

-- POLICIES: compras (extender)
drop policy if exists "admins can read purchases" on public.compras;

create policy "compras_select_org_members"
  on public.compras for select
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.eventos e
      where e.id = compras.evento_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

-- POLICIES: payments
create policy "payments_select_org"
  on public.payments for select
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.compras c
      join public.eventos e on e.id = c.evento_id
      where c.id = payments.purchase_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

create policy "payments_insert_system"
  on public.payments for insert
  with check (true);

-- POLICIES: tickets
drop policy if exists "admins can manage tickets" on public.tickets;

create policy "tickets_select_org"
  on public.tickets for select
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.eventos e
      where e.id = tickets.evento_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

create policy "tickets_insert_checkin"
  on public.tickets for update
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.eventos e
      where e.id = tickets.evento_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

-- POLICIES: scans
create policy "scans_select_org"
  on public.scans for select
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.eventos e
      where e.id = scans.event_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

create policy "scans_insert_org_members"
  on public.scans for insert
  with check (
    public.current_user_role() in ('super_admin', 'admin', 'staff')
  );

-- POLICIES: logs
create policy "logs_select_org"
  on public.logs for select
  using (
    public.current_user_role() = 'super_admin'
    or (
      organization_id is not null
      and public.user_belongs_to_org(organization_id)
    )
  );

create policy "logs_insert_system"
  on public.logs for insert
  with check (true);

-- POLICIES: organization_settings
create policy "org_settings_select_members"
  on public.organization_settings for select
  using (
    public.current_user_role() = 'super_admin'
    or public.user_belongs_to_org(organization_id)
  );

create policy "org_settings_update_admin"
  on public.organization_settings for update
  using (
    public.current_user_role() = 'super_admin'
    or public.user_org_role(organization_id) = 'admin'
  );

-- POLICIES: validaciones (extender existentes)
drop policy if exists "admins can insert validations" on public.validaciones;

create policy "validaciones_insert_staff"
  on public.validaciones for insert
  with check (
    public.current_user_role() in ('super_admin', 'admin', 'staff')
  );

create policy "validaciones_select_org"
  on public.validaciones for select
  using (
    public.current_user_role() = 'super_admin'
    or exists (
      select 1 from public.tickets t
      join public.eventos e on e.id = t.evento_id
      where t.id = validaciones.ticket_id
        and (
          e.organization_id is not null
          and public.user_belongs_to_org(e.organization_id)
        )
    )
  );

-- ============================================================================
-- TRIGGER: actualizar updated_at automáticamente
-- ============================================================================
create extension if not exists "moddatetime";

create trigger handle_organizations_updated_at
  before update on public.organizations
  for each row execute function moddatetime(updated_at);

create trigger handle_organization_users_updated_at
  before update on public.organization_users
  for each row execute function moddatetime(updated_at);

create trigger handle_payments_updated_at
  before update on public.payments
  for each row execute function moddatetime(updated_at);

create trigger handle_organization_settings_updated_at
  before update on public.organization_settings
  for each row execute function moddatetime(updated_at);
