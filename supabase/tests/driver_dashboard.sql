-- Integration tests use temporary users and roll back every fixture.
begin;
create temporary table driver_test_accounts (kind text, user_id uuid, profile_id uuid, service_id text) on commit drop;
insert into driver_test_accounts
select kind, gen_random_uuid(), gen_random_uuid(), gen_random_uuid()::text
from (values ('driver'), ('other_driver'), ('car_rental'), ('traveler')) t(kind);
insert into auth.users(id) select user_id from driver_test_accounts;
insert into public.provider_profiles(id, user_id, provider_type, display_name, location)
select profile_id, user_id, case when kind = 'car_rental' then 'car_rental' else 'driver' end, 'Dashboard test', 'Montego Bay'
from driver_test_accounts where kind <> 'traveler';
insert into public.listings(id, owner_id, provider_profile_id, category, title, image_url, price, rating, price_suffix, status)
select service_id, user_id, profile_id, 'transport', 'Dashboard test service', 'https://example.com/car.jpg', 100, 0, '/day', 'published'
from driver_test_accounts where kind <> 'traveler';
create temporary table driver_test_bookings (id uuid, kind text, service_id text) on commit drop;
insert into driver_test_bookings
select gen_random_uuid(), kind, service_id from driver_test_accounts where kind <> 'traveler';
insert into driver_test_bookings select gen_random_uuid(), 'cancel_test', service_id from driver_test_accounts where kind = 'driver';
grant select on driver_test_accounts, driver_test_bookings to authenticated;

set local role authenticated;
select set_config('request.jwt.claim.sub', (select user_id::text from driver_test_accounts where kind = 'traveler'), true);
insert into public.reservations(id, user_id, listing_id, category, starts_at, ends_at, party_size, unit_count, subtotal, service_fee, total, driver_status)
select b.id, (select user_id from driver_test_accounts where kind = 'traveler'), b.service_id, 'transport',
now() + interval '2 days', now() + interval '3 days', 2, 1, 0, 0, 0, 'completed'
from driver_test_bookings b;
do $$
declare changed integer;
begin
  if (select count(*) from public.reservations where id in (select id from driver_test_bookings) and driver_status = 'scheduled') <> 4 then
    raise exception 'Traveler could forge trip progress at creation';
  end if;
  update public.reservations set driver_status = 'in_progress' where id in (select id from driver_test_bookings);
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Traveler could change driver progress'; end if;
end $$;

select set_config('request.jwt.claim.sub', (select user_id::text from driver_test_accounts where kind = 'driver'), true);
do $$
declare own_id uuid; cancel_id uuid; changed integer; denied boolean;
begin
  select id into own_id from driver_test_bookings where kind = 'driver';
  select id into cancel_id from driver_test_bookings where kind = 'cancel_test';
  if (select count(*) from public.reservations where id in (select id from driver_test_bookings)) <> 2 then
    raise exception 'Driver booking visibility not limited to own services';
  end if;
  update public.reservations set driver_status = 'in_progress' where id in (select id from driver_test_bookings where kind in ('other_driver', 'car_rental'));
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-driver booking update allowed'; end if;
  begin
    update public.reservations set total = 1 where id = own_id;
    raise exception 'Driver changed booking price';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.reservations set payment_status = 'paid' where id = own_id;
    raise exception 'Driver changed payment status';
  exception when insufficient_privilege then null;
  end;
  denied := false;
  begin
    update public.reservations set driver_status = 'completed' where id = own_id;
  exception when raise_exception then denied := true;
  end;
  if not denied then raise exception 'Scheduled trip skipped start'; end if;
  update public.reservations set driver_status = 'in_progress' where id = own_id;
  if (select driver_status from public.reservations where id = own_id) <> 'in_progress' then raise exception 'Start failed'; end if;
  update public.reservations set driver_status = 'completed' where id = own_id;
  if (select driver_status from public.reservations where id = own_id) <> 'completed' then raise exception 'Completion failed'; end if;
  denied := false;
  begin
    update public.reservations set driver_status = 'scheduled' where id = own_id;
  exception when raise_exception then denied := true;
  end;
  if not denied then raise exception 'Completed trip reopened'; end if;
  update public.reservations set status = 'cancelled' where id = cancel_id;
  if (select status from public.reservations where id = cancel_id) <> 'cancelled' then raise exception 'Cancellation failed'; end if;
  denied := false;
  begin
    update public.reservations set status = 'confirmed' where id = cancel_id;
  exception when raise_exception then denied := true;
  end;
  if not denied then raise exception 'Cancelled booking reopened'; end if;
  update public.listings set status = 'archived' where id = (select service_id from driver_test_accounts where kind = 'driver');
  if (select count(*) from public.reservations where id in (select id from driver_test_bookings)) <> 2 then raise exception 'Pausing service hid existing bookings'; end if;
end $$;

select set_config('request.jwt.claim.sub', (select user_id::text from driver_test_accounts where kind = 'car_rental'), true);
do $$
begin
  if (select count(*) from public.reservations where id in (select id from driver_test_bookings)) <> 1 then
    raise exception 'Rental provider must see only its own booking';
  end if;
end $$;

select set_config('request.jwt.claim.sub', (select user_id::text from driver_test_accounts where kind = 'traveler'), true);
do $$
begin
  if (select status from public.reservations where id = (select id from driver_test_bookings where kind = 'cancel_test')) <> 'cancelled' then
    raise exception 'Traveler cannot see cancellation';
  end if;
  if (select count(*) from public.reservations where id in (select id from driver_test_bookings)) <> 4 then
    raise exception 'Traveler reservation access regressed';
  end if;
end $$;
reset role;
select 'Passed: driver isolation, traveler access, trip transitions, cancellations, payment protection, paused services' as result;
rollback;
