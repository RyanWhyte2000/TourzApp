alter table public.listings add column if not exists owner_id uuid references auth.users(id) on delete set null;
alter table public.listings add column if not exists description text;
create index if not exists listings_owner_status_idx on public.listings (owner_id, status);
grant insert, update, delete on public.listings to authenticated;

drop policy if exists "Hosts can view own listings" on public.listings;
create policy "Hosts can view own listings" on public.listings for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Hosts can create own listings" on public.listings;
create policy "Hosts can create own listings" on public.listings for insert to authenticated
with check ((select auth.uid()) = owner_id and status = 'draft');

drop policy if exists "Hosts can update own listings" on public.listings;
create policy "Hosts can update own listings" on public.listings for update to authenticated
using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

drop policy if exists "Hosts can delete own draft listings" on public.listings;
create policy "Hosts can delete own draft listings" on public.listings for delete to authenticated
using ((select auth.uid()) = owner_id and status = 'draft');
notify pgrst, 'reload schema';
