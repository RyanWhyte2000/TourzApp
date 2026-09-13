create or replace function public.get_public_provider_names(p_ids uuid[])
returns table (id uuid, display_name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.display_name
  from public.provider_profiles p
  where p.id = any(coalesce(p_ids, '{}'::uuid[]));
$$;

revoke all on function public.get_public_provider_names(uuid[]) from public;
grant execute on function public.get_public_provider_names(uuid[]) to anon, authenticated;

notify pgrst, 'reload schema';
