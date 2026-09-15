-- Extend the existing booking workflow to each provider's own listings.
drop policy if exists "Drivers read bookings for own services" on public.reservations;
drop policy if exists "Drivers update bookings for own services" on public.reservations;

create policy "Providers read bookings for own listings" on public.reservations
for select to authenticated using (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and l.category = p.category
  )
);
create policy "Providers update bookings for own listings" on public.reservations
for update to authenticated using (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and l.category = p.category
  )
) with check (
  exists (
    select 1 from public.listings l
    join public.provider_profiles p on p.id = l.provider_profile_id
    where l.id = reservations.listing_id and l.owner_id = (select auth.uid())
      and p.user_id = (select auth.uid()) and l.category = p.category
  )
);
-- The existing transition trigger protects this shared fulfillment stage.
-- Existing column grants allow only status/progress updates, never financial edits.
comment on column public.reservations.driver_status is
'Shared provider fulfillment stage: scheduled, in_progress, completed. Legacy name retained for driver compatibility.';
notify pgrst, 'reload schema';
