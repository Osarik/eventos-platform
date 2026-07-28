create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'staff', 'customer');
create type public.event_status as enum ('draft', 'active', 'paused', 'finished');
create type public.purchase_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.ticket_status as enum ('valid', 'used', 'cancelled');
create type public.validation_result as enum ('accepted', 'rejected');

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.usuarios(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null,
  venue text not null,
  city text not null,
  address text not null,
  starts_at timestamptz not null,
  image_path text,
  price_cop integer not null check (price_cop >= 0),
  capacity integer not null check (capacity > 0),
  status public.event_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.compras (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventos(id) on delete restrict,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  quantity integer not null check (quantity > 0),
  amount_cop integer not null check (amount_cop >= 0),
  status public.purchase_status not null default 'pending',
  wompi_transaction_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  compra_id uuid not null references public.compras(id) on delete cascade,
  evento_id uuid not null references public.eventos(id) on delete restrict,
  code text not null unique,
  attendee_name text not null,
  attendee_email text not null,
  status public.ticket_status not null default 'valid',
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.validaciones (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  validated_by uuid references public.usuarios(id) on delete set null,
  result public.validation_result not null,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.usuarios enable row level security;
alter table public.eventos enable row level security;
alter table public.compras enable row level security;
alter table public.tickets enable row level security;
alter table public.validaciones enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.usuarios where id = auth.uid()
$$;

create policy "users can read own profile"
  on public.usuarios for select
  using (id = auth.uid());

create policy "admins can manage profiles"
  on public.usuarios for all
  using (public.current_user_role() = 'admin');

create policy "public can read active events"
  on public.eventos for select
  using (status = 'active');

create policy "admins can manage events"
  on public.eventos for all
  using (public.current_user_role() in ('admin', 'staff'));

create policy "admins can read purchases"
  on public.compras for select
  using (public.current_user_role() in ('admin', 'staff'));

create policy "admins can manage tickets"
  on public.tickets for all
  using (public.current_user_role() in ('admin', 'staff'));

create policy "admins can insert validations"
  on public.validaciones for insert
  with check (public.current_user_role() in ('admin', 'staff'));
