create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id text not null references public.listings(id) on delete restrict,
  category text not null check (category in ('airbnb', 'hotel', 'food', 'transport')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  party_size integer not null check (party_size between 1 and 30),
  unit_count integer not null check (unit_count between 1 and 365),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  service_fee numeric(10, 2) not null check (service_fee >= 0),
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null default 'pay_later' check (payment_method = 'pay_later'),
  payment_status text not null default 'not_charged' check (payment_status in ('not_charged', 'paid', 'refunded')),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists reservations_user_created_idx on public.reservations (user_id, created_at desc);
alter table public.reservations enable row level security;
grant select, insert on public.reservations to authenticated;

drop policy if exists "Users can view their reservations" on public.reservations;
create policy "Users can view their reservations" on public.reservations
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their reservations" on public.reservations;
create policy "Users can create their reservations" on public.reservations
for insert to authenticated with check ((select auth.uid()) = user_id);

notify pgrst, 'reload schema';
