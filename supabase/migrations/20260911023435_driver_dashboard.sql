alter table public.reservations add column driver_status text not null default 'scheduled'
check (driver_status in ('scheduled', 'in_progress', 'completed'));

create index reservations_listing_start_idx on public.reservations (listing_id, starts_at);

create policy "Drivers read bookings for own services" on public.reservations
for select to authenticated using (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and p.provider_type = 'driver'
  )
);

grant update (status, driver_status) on public.reservations to authenticated;
create policy "Drivers update bookings for own services" on public.reservations
for update to authenticated using (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and p.provider_type = 'driver'
  )
) with check (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and p.provider_type = 'driver'
  )
);

-- Enforce transitions for direct API writes as well as server actions.
create function public.validate_driver_booking_transition()
returns trigger language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    new.driver_status := 'scheduled';
    return new;
  end if;
  if new.status = old.status and new.driver_status = old.driver_status then return new; end if;
  if old.status = 'cancelled' or old.driver_status = 'completed' then
    raise exception 'This booking is already closed';
  end if;
  if new.status = 'cancelled' and old.status in ('pending', 'confirmed')
    and old.driver_status = 'scheduled' and new.driver_status = old.driver_status then return new; end if;
  if old.status = 'pending' and new.status = 'confirmed'
    and old.driver_status = 'scheduled' and new.driver_status = 'scheduled' then return new; end if;
  if old.status = 'confirmed' and new.status = old.status then
    if old.driver_status = 'scheduled' and new.driver_status = 'in_progress' then return new; end if;
    if old.driver_status = 'in_progress' and new.driver_status = 'completed' then return new; end if;
  end if;
  raise exception 'Invalid driver booking transition';
end;
$$;
revoke all on function public.validate_driver_booking_transition() from public;
create trigger initialize_driver_booking_status before insert on public.reservations
for each row execute function public.validate_driver_booking_transition();
create trigger validate_driver_booking_transition before update of status, driver_status on public.reservations
for each row execute function public.validate_driver_booking_transition();

notify pgrst, 'reload schema';
