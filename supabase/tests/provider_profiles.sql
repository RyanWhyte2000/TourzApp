-- Transactional integration checks: all fixtures are rolled back.
begin;
create temporary table provider_test_fixtures (
  user_id uuid, profile_id uuid, provider_type text, category text
) on commit drop;
insert into provider_test_fixtures
select gen_random_uuid(), gen_random_uuid(), provider_type, category
from (values ('driver', 'transport'), ('hotel_owner', 'hotel'), ('car_rental', 'transport'), ('airbnb_owner', 'airbnb'), ('restaurant_owner', 'food')) as types(provider_type, category);
insert into auth.users(id) select user_id from provider_test_fixtures;
grant select on provider_test_fixtures to authenticated;

set local role authenticated;
do $$
declare fixture record; changed integer;
begin
  for fixture in select * from provider_test_fixtures loop
    perform set_config('request.jwt.claim.sub', fixture.user_id::text, true);
    insert into public.provider_profiles(id, user_id, provider_type, display_name, location)
    values (fixture.profile_id, fixture.user_id, fixture.provider_type, 'Test business', 'Montego Bay');
    if (select count(*) from public.provider_profiles) <> 1 then
      raise exception 'Profile isolation failed';
    end if;
    update public.provider_profiles set display_name = 'Updated business' where id = fixture.profile_id;
    if (select display_name from public.provider_profiles where id = fixture.profile_id) <> 'Updated business' then
      raise exception 'Owner update failed';
    end if;
    begin
      insert into public.provider_profiles(user_id, provider_type, display_name, location)
      values (fixture.user_id, case when fixture.provider_type = 'driver' then 'car_rental' else 'driver' end, 'Second business', 'Montego Bay');
      raise exception 'Second profile incorrectly allowed';
    exception when unique_violation then null;
    end;
    begin
      update public.provider_profiles set provider_type = 'driver' where id = fixture.profile_id;
      raise exception 'Provider type mutation incorrectly allowed';
    exception when insufficient_privilege then null;
    end;
    insert into public.listings(id, owner_id, provider_profile_id, category, title, image_url, price, rating, price_suffix, status)
    values (fixture.profile_id::text, fixture.user_id, fixture.profile_id, fixture.category, 'Provider test', 'https://example.com/image.jpg', 100, 0, '/day', 'draft');
    begin
      insert into public.listings(id, owner_id, provider_profile_id, category, title, image_url, price, rating, price_suffix, status)
      values ('wrong-' || fixture.profile_id::text, fixture.user_id, fixture.profile_id, case when fixture.category = 'hotel' then 'food' else 'hotel' end, 'Wrong category', 'https://example.com/image.jpg', 100, 0, '/day', 'draft');
      raise exception 'Mismatched category incorrectly allowed';
    exception when foreign_key_violation then null;
    end;
    begin
      insert into public.listings(id, owner_id, category, title, image_url, price, rating, price_suffix, status)
      values ('unlinked-' || fixture.profile_id::text, fixture.user_id, fixture.category, 'Unlinked', 'https://example.com/image.jpg', 100, 0, '/day', 'draft');
      raise exception 'New listing without profile incorrectly allowed';
    exception when insufficient_privilege then null;
    end;
  end loop;
  -- All other fixtures now exist; verify cross-account writes are denied.
  for fixture in select * from provider_test_fixtures loop
    perform set_config('request.jwt.claim.sub', fixture.user_id::text, true);
    update public.provider_profiles set display_name = 'Wrong owner' where user_id <> fixture.user_id;
    get diagnostics changed = row_count;
    if changed <> 0 then raise exception 'Cross-owner update allowed'; end if;
    begin
      insert into public.provider_profiles(user_id, provider_type, display_name, location)
      select user_id, provider_type, 'Wrong owner', 'Montego Bay' from provider_test_fixtures where user_id <> fixture.user_id limit 1;
      raise exception 'Cross-owner insert allowed';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.listings set provider_profile_id = (select profile_id from provider_test_fixtures where user_id <> fixture.user_id limit 1)
      where id = fixture.profile_id::text;
      raise exception 'Cross-owner listing assignment allowed';
    exception when foreign_key_violation then null;
    end;
  end loop;
end $$;

set local role anon;
do $$
begin
  begin
    perform 1 from public.provider_profiles;
    raise exception 'Anonymous profile read allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select 'Passed: five provider types, owner CRUD permissions, one profile per account, immutable type, listing ownership/category, anonymous access' as result;
rollback;
