create table public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  provider_type text not null check (provider_type in ('driver', 'hotel_owner', 'car_rental', 'airbnb_owner', 'restaurant_owner')),
  category text generated always as (
    case provider_type
      when 'driver' then 'transport'
      when 'car_rental' then 'transport'
      when 'hotel_owner' then 'hotel'
      when 'airbnb_owner' then 'airbnb'
      when 'restaurant_owner' then 'food'
    end
  ) stored,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  location text not null check (char_length(btrim(location)) between 2 and 200),
  contact_email text not null default '' check (char_length(contact_email) <= 254),
  phone text not null default '' check (char_length(phone) <= 40),
  website text not null default '' check (char_length(website) <= 500),
  details jsonb not null default '{}' check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id, category)
);

alter table public.provider_profiles enable row level security;
revoke all on public.provider_profiles from public, anon, authenticated;
grant select, insert on public.provider_profiles to authenticated;
-- Identity and provider type cannot be changed through the Data API.
grant update (display_name, description, location, contact_email, phone, website, details, updated_at)
on public.provider_profiles to authenticated;

create policy "Providers read own profile" on public.provider_profiles
for select to authenticated using ((select auth.uid()) = user_id);
create policy "Providers create own profile" on public.provider_profiles
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Providers edit own profile" on public.provider_profiles
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Keep earlier listings intact until their owner explicitly assigns them.
alter table public.listings add column provider_profile_id uuid;
alter table public.listings add constraint listings_provider_owner_category_fk
foreign key (provider_profile_id, owner_id, category)
references public.provider_profiles (id, user_id, category);
create index listings_provider_profile_idx on public.listings (provider_profile_id, owner_id, category);

drop policy if exists "Hosts can create own listings" on public.listings;
create policy "Hosts can create own listings" on public.listings
for insert to authenticated
with check ((select auth.uid()) = owner_id and status = 'draft' and provider_profile_id is not null);

notify pgrst, 'reload schema';
