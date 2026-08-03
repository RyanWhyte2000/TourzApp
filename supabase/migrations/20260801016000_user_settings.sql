create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', phone text, avatar_url text, date_of_birth date,
  preferred_language text not null default 'en', country text, emergency_contact_name text,
  emergency_contact_phone text, profile_visibility text not null default 'private' check (profile_visibility in ('private','hosts','public')),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'USD', default_destination text, default_travelers integer not null default 1 check (default_travelers between 1 and 30),
  accessibility_needs text, accommodation_preferences text, dietary_restrictions text, preferred_vehicle_type text,
  smoking_preference text not null default 'non-smoking', default_guest_count integer not null default 1 check (default_guest_count between 1 and 30),
  default_checkin_requirements text, special_requests text, preferred_payment_option text not null default 'pay_later',
  billing_address text, receipt_email text, invoice_details text,
  notify_booking_confirmations boolean not null default true, notify_booking_reminders boolean not null default true,
  notify_reservation_changes boolean not null default true, notify_price_drops boolean not null default true,
  notify_wishlist_availability boolean not null default true, notify_promotions boolean not null default false,
  notify_support_replies boolean not null default true, notify_email boolean not null default true, notify_push boolean not null default false,
  marketing_consent boolean not null default false, updated_at timestamptz not null default now()
);

create table if not exists public.host_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  host_enabled boolean not null default false, business_name text, service_categories text[] not null default '{}',
  payout_provider text, payout_status text not null default 'not_connected', tax_country text, tax_status text not null default 'not_submitted',
  booking_approval text not null default 'manual', cancellation_policy text not null default 'flexible', availability_preferences text,
  auto_confirm boolean not null default false, notify_new_bookings boolean not null default true, notify_cancellations boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  reason text, status text not null default 'requested' check (status in ('requested','processing','completed','cancelled')),
  requested_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.host_settings enable row level security;
alter table public.account_deletion_requests enable row level security;
grant select, insert, update on public.profiles, public.user_settings, public.host_settings to authenticated;
grant select, insert on public.account_deletion_requests to authenticated;

create policy "Users manage own profile" on public.profiles for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own settings" on public.user_settings for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own host settings" on public.host_settings for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users view own deletion requests" on public.account_deletion_requests for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users request own deletion" on public.account_deletion_requests for insert to authenticated with check ((select auth.uid()) = user_id);
notify pgrst, 'reload schema';
