begin;
create temporary table multi_owner (id uuid) on commit drop;
insert into multi_owner values (gen_random_uuid()), (gen_random_uuid());
insert into auth.users(id) select id from multi_owner;
grant select on multi_owner to authenticated;
set local role authenticated;
do $$
declare owner_id uuid; other_id uuid; kind text; profile uuid; changed integer;
begin
  select id into owner_id from multi_owner limit 1;
  select id into other_id from multi_owner where id <> owner_id;
  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  foreach kind in array array['driver','hotel_owner','car_rental','airbnb_owner','restaurant_owner'] loop
    insert into public.provider_profiles(user_id, provider_type, display_name, location)
    values(owner_id, kind, kind, 'Kingston') returning id into profile;
    insert into public.listings(id, owner_id, provider_profile_id, category, title, image_url, price, rating, price_suffix, status)
    select gen_random_uuid()::text, owner_id, profile, p.category, 'Multi listing', 'https://example.com/image.jpg', 100, 0, '/day', 'draft'
    from public.provider_profiles p cross join generate_series(1,2) where p.id = profile;
    if (select count(*) from public.listings where provider_profile_id = profile) <> 2 then raise exception 'Multiple listings failed'; end if;
    begin
      insert into public.provider_profiles(user_id, provider_type, display_name, location) values(owner_id, kind, 'Duplicate', 'Kingston');
      raise exception 'Duplicate category allowed';
    exception when unique_violation then null;
    end;
  end loop;
  if (select count(*) from public.provider_profiles) <> 5 then raise exception 'Multiple categories failed'; end if;
  if (select count(*) from public.listings where category = 'transport' and provider_profile_id in (select id from public.provider_profiles where provider_type = 'driver')) <> 2 then raise exception 'Driver and rental mixed'; end if;
  perform set_config('request.jwt.claim.sub', other_id::text, true);
  if (select count(*) from public.provider_profiles) <> 0 then raise exception 'Cross-owner profile read'; end if;
  update public.listings set title = 'Wrong owner' where provider_profile_id is not null;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-owner listing edit'; end if;
end $$;
reset role;
select 'Passed: all five categories on one account, two listings each, duplicate prevention and owner isolation' as result;
rollback;
