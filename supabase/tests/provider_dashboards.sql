begin;
create temporary table dashboard_test_accounts (provider_type text, user_id uuid, profile_id uuid, listing_id text, category text) on commit drop;
insert into dashboard_test_accounts
select type, gen_random_uuid(), gen_random_uuid(), gen_random_uuid()::text, category
from (values ('driver','transport'), ('hotel_owner','hotel'), ('car_rental','transport'), ('airbnb_owner','airbnb'), ('restaurant_owner','food')) t(type,category);
create temporary table dashboard_test_traveler (user_id uuid) on commit drop;
insert into dashboard_test_traveler values (gen_random_uuid());
insert into auth.users(id) select user_id from dashboard_test_accounts union all select user_id from dashboard_test_traveler;
insert into public.provider_profiles(id,user_id,provider_type,display_name,location)
select profile_id,user_id,provider_type,'Dashboard test','Montego Bay' from dashboard_test_accounts;
insert into public.listings(id,owner_id,provider_profile_id,category,title,image_url,price,rating,price_suffix,status)
select listing_id,user_id,profile_id,category,'Dashboard test listing','https://example.com/image.jpg',100,0,
case when category='food' then '/person' when category='transport' then '/day' else '/night' end,'published'
from dashboard_test_accounts;
create temporary table dashboard_test_bookings(id uuid, listing_id text, cancel_test boolean) on commit drop;
insert into dashboard_test_bookings select gen_random_uuid(),listing_id,cancel_test from dashboard_test_accounts cross join (values (true),(false)) t(cancel_test);
grant select on dashboard_test_accounts,dashboard_test_traveler,dashboard_test_bookings to authenticated;

set local role authenticated;
select set_config('request.jwt.claim.sub',(select user_id::text from dashboard_test_traveler),true);
insert into public.reservations(id,user_id,listing_id,category,starts_at,ends_at,party_size,unit_count,subtotal,service_fee,total)
select b.id,(select user_id from dashboard_test_traveler),b.listing_id,a.category,now()+interval '2 days',
case when a.category='food' then null else now()+interval '3 days' end,2,1,0,0,0
from dashboard_test_bookings b join dashboard_test_accounts a on a.listing_id=b.listing_id;

do $$
declare actor record; booking_id uuid; cancel_id uuid; changed integer; denied boolean;
begin
  for actor in select * from dashboard_test_accounts loop
    perform set_config('request.jwt.claim.sub',actor.user_id::text,true);
    if (select count(*) from public.reservations where id in (select id from dashboard_test_bookings)) <> 2 then raise exception 'Provider visibility failed for %',actor.provider_type; end if;
    update public.reservations set status='cancelled' where listing_id<>actor.listing_id and id in (select id from dashboard_test_bookings);
    get diagnostics changed=row_count;
    if changed<>0 then raise exception 'Cross-provider booking update allowed'; end if;
    update public.listings set title='Wrong owner' where id<>actor.listing_id and id in (select listing_id from dashboard_test_accounts);
    get diagnostics changed=row_count;
    if changed<>0 then raise exception 'Cross-provider listing edit allowed'; end if;
    update public.listings set title='Updated listing' where id=actor.listing_id;
    get diagnostics changed=row_count;
    if changed<>1 then raise exception 'Owner listing edit failed'; end if;
    select id into booking_id from dashboard_test_bookings where listing_id=actor.listing_id and not cancel_test;
    select id into cancel_id from dashboard_test_bookings where listing_id=actor.listing_id and cancel_test;
    begin
      update public.reservations set total=1 where id=booking_id;
      raise exception 'Financial edit allowed';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.reservations set payment_status='paid' where id=booking_id;
      raise exception 'Payment edit allowed';
    exception when insufficient_privilege then null;
    end;
    denied:=false;
    begin update public.reservations set driver_status='completed' where id=booking_id;
    exception when raise_exception then denied:=true; end;
    if not denied then raise exception 'Invalid transition allowed'; end if;
    update public.reservations set driver_status='in_progress' where id=booking_id;
    update public.reservations set driver_status='completed' where id=booking_id;
    if (select driver_status from public.reservations where id=booking_id)<>'completed' then raise exception 'Completion failed'; end if;
    update public.reservations set status='cancelled' where id=cancel_id;
    denied:=false;
    begin update public.reservations set status='confirmed' where id=cancel_id;
    exception when raise_exception then denied:=true; end;
    if not denied then raise exception 'Cancelled booking reopened'; end if;
    update public.listings set status='archived' where id=actor.listing_id;
    if (select count(*) from public.reservations where id in (select id from dashboard_test_bookings))<>2 then raise exception 'Archived listing hid bookings'; end if;
  end loop;
  perform set_config('request.jwt.claim.sub',(select user_id::text from dashboard_test_traveler),true);
  if (select count(*) from public.reservations where id in (select id from dashboard_test_bookings))<>10 then raise exception 'Traveler visibility regressed'; end if;
  update public.reservations set driver_status='in_progress' where id in (select id from dashboard_test_bookings);
  get diagnostics changed=row_count;
  if changed<>0 then raise exception 'Traveler modified provider workflow'; end if;
end $$;
reset role;
select 'Passed for all five profiles: booking/listing isolation, owner editing, fulfillment, cancellation, financial protection, traveler access' as result;
rollback;
