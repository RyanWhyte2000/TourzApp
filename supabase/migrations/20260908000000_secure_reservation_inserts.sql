-- All insert paths, including the public REST API, use authoritative pricing.
create or replace function public.prepare_reservation_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  listing_price numeric;
  listing_category text;
begin
  select price, category into listing_price, listing_category
  from public.listings where id = new.listing_id and status = 'published';
  if not found then
    raise exception 'Listing is unavailable';
  end if;
  if new.starts_at is null or not isfinite(new.starts_at)
    or new.starts_at < now() - interval '1 day'
    or (new.ends_at is not null and (not isfinite(new.ends_at) or new.ends_at <= new.starts_at))
    or (listing_category <> 'food' and new.ends_at is null) then
    raise exception 'Invalid reservation dates';
  end if;

  new.category := listing_category;
  new.unit_count := case when listing_category = 'food' then new.party_size
    else greatest(1, ceil(extract(epoch from (new.ends_at - new.starts_at)) / 86400)::integer) end;
  new.subtotal := round(listing_price * new.unit_count, 2);
  new.service_fee := round(new.subtotal * 0.08, 2);
  new.total := new.subtotal + new.service_fee;
  new.payment_method := 'pay_later';
  new.payment_status := 'not_charged';
  new.status := 'confirmed';
  return new;
end;
$$;

revoke all on function public.prepare_reservation_insert() from public;
create trigger prepare_reservation_insert
before insert on public.reservations
for each row execute function public.prepare_reservation_insert();

notify pgrst, 'reload schema';
