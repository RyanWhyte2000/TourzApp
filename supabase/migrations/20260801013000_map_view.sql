create extension if not exists postgis with schema extensions;

alter table public.listings
add column if not exists location extensions.geography(point, 4326);

create index if not exists listings_location_idx
on public.listings using gist (location);

update public.listings as listing
set location = extensions.st_point(coordinates.longitude, coordinates.latitude)::extensions.geography
from (values
  ('ironshore-mansion', 18.5030, -77.8790),
  ('starlit-summit-cabin', 18.4870, -77.9150),
  ('moonlit-timber-haven', 18.4620, -77.9270),
  ('crystal-lake-hideout', 18.4500, -77.9040),
  ('sunset-valley-retreat', 18.4700, -77.9450),
  ('oceanview-villa', 18.5120, -77.9010),
  ('half-moon-resort', 18.5225, -77.8255),
  ('secrets-st-james', 18.4715, -77.9390),
  ('riu-montego-bay', 18.5135, -77.8810),
  ('deja-resort', 18.4890, -77.9280),
  ('s-hotel-montego-bay', 18.4875, -77.9295),
  ('holiday-inn-resort', 18.5200, -77.8390),
  ('scotchies-jerk-centre', 18.5005, -77.8910),
  ('pelican-grill', 18.4785, -77.9220),
  ('margaritaville-montego-bay', 18.4860, -77.9290),
  ('pier-one-seafood', 18.4660, -77.9210),
  ('juici-patties', 18.4550, -77.8990),
  ('evitas-italian-restaurant', 18.4820, -77.9370),
  ('toyota-corolla-2024', 18.5020, -77.9130),
  ('honda-crv-suv', 18.5180, -77.8430),
  ('mercedes-benz-e-class', 18.5040, -77.8830),
  ('toyota-hiace-van', 18.4720, -77.9190),
  ('nissan-sentra', 18.4680, -77.9440),
  ('jeep-wrangler-4x4', 18.4930, -77.9720)
) as coordinates(id, latitude, longitude)
where listing.id = coordinates.id;

drop function if exists public.search_listings(text, text, text[], numeric, numeric, numeric, jsonb, integer, integer, text);

create function public.search_listings(
  p_category text,
  p_destination text default null,
  p_tags text[] default '{}',
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_min_rating numeric default null,
  p_numeric_filters jsonb default '{}',
  p_limit integer default 9,
  p_offset integer default 0,
  p_sort text default 'latest',
  p_include_map boolean default false
)
returns jsonb
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with filtered as materialized (
    select listing.*
    from public.listings as listing
    where listing.status = 'published'
      and listing.category = p_category
      and (p_destination is null or listing.location_search ilike '%' || p_destination || '%')
      and listing.filter_tags @> coalesce(p_tags, '{}')
      and (p_min_price is null or listing.price >= p_min_price)
      and (p_max_price is null or listing.price <= p_max_price)
      and (p_min_rating is null or listing.rating >= p_min_rating)
      and not exists (
        select 1
        from jsonb_each_text(coalesce(p_numeric_filters, '{}')) as requested(key, value)
        where coalesce((listing.filter_values ->> requested.key)::numeric, 0) < requested.value::numeric
      )
  ),
  page_rows as (
    select *
    from filtered
    order by
      case when p_sort = 'price_asc' then price end asc,
      case when p_sort = 'price_desc' then price end desc,
      case when p_sort = 'rating' then rating end desc,
      case when p_sort = 'oldest' then created_at end asc,
      case when p_sort = 'latest' then created_at end desc,
      rating desc,
      id asc
    limit greatest(1, least(coalesce(p_limit, 9), 50))
    offset greatest(0, coalesce(p_offset, 0))
  ),
  map_rows as (
    select jsonb_build_object(
      'id', id,
      'title', title,
      'image', image_url,
      'price', price,
      'rating', rating,
      'subtitle', subtitle,
      'latitude', extensions.st_y(location::extensions.geometry),
      'longitude', extensions.st_x(location::extensions.geometry)
    ) as marker
    from filtered
    where p_include_map and location is not null
    order by rating desc
    limit 250
  )
  select jsonb_build_object(
    'items', coalesce((select jsonb_agg(to_jsonb(page_rows)) from page_rows), '[]'::jsonb),
    'mapItems', coalesce((select jsonb_agg(marker) from map_rows), '[]'::jsonb),
    'totalCount', (select count(*) from filtered)
  );
$$;

grant execute on function public.search_listings(text, text, text[], numeric, numeric, numeric, jsonb, integer, integer, text, boolean)
to anon, authenticated;

notify pgrst, 'reload schema';
