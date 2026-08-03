create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id text not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index if not exists favorites_user_created_idx
on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;
grant select, insert, delete on public.favorites to authenticated;

drop policy if exists "Users can read their favorites" on public.favorites;
create policy "Users can read their favorites"
on public.favorites for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their favorites" on public.favorites;
create policy "Users can add their favorites"
on public.favorites for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove their favorites" on public.favorites;
create policy "Users can remove their favorites"
on public.favorites for delete to authenticated
using ((select auth.uid()) = user_id);

notify pgrst, 'reload schema';
