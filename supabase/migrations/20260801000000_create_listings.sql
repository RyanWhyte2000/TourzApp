create table if not exists public.listings (
  id text primary key,
  category text not null check (category in ('airbnb', 'hotel', 'food', 'transport')),
  title text not null,
  image_url text not null,
  price numeric(10, 2) not null check (price >= 0),
  rating numeric(2, 1) not null check (rating between 0 and 5),
  subtitle text,
  location_search text not null default 'Montego Bay, Jamaica',
  price_suffix text not null,
  total_price text,
  filter_tags text[] not null default '{}',
  filter_values jsonb not null default '{}',
  meta jsonb not null default '[]',
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_category_status_idx on public.listings (category, status);
create index if not exists listings_price_idx on public.listings (price);
create index if not exists listings_rating_idx on public.listings (rating);
create index if not exists listings_filter_tags_idx on public.listings using gin (filter_tags);

alter table public.listings enable row level security;
grant select on public.listings to anon, authenticated;

drop policy if exists "Published listings are publicly readable" on public.listings;
create policy "Published listings are publicly readable"
on public.listings for select
to anon, authenticated
using (status = 'published');

create or replace function public.search_listings(
  p_category text,
  p_destination text default null,
  p_tags text[] default '{}',
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_min_rating numeric default null,
  p_numeric_filters jsonb default '{}'
)
returns setof public.listings
language sql
stable
security invoker
set search_path = public
as $$
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
  order by listing.rating desc, listing.created_at desc;
$$;

grant execute on function public.search_listings(text, text, text[], numeric, numeric, numeric, jsonb)
to anon, authenticated;

insert into public.listings
  (id, category, title, image_url, price, rating, subtitle, price_suffix, total_price, filter_tags, filter_values, meta)
values
  ('ironshore-mansion', 'airbnb', 'Beautiful Ironshore Mansion', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', 620, 4.8, 'Ironshore, Montego Bay', '/night', '$12,400/total', array['Entire place','House','Iconic Cities'], '{"bedrooms":3,"beds":3,"bathrooms":1}', '[{"label":"3 bed"},{"label":"1 bath"}]'),
  ('starlit-summit-cabin', 'airbnb', 'Starlit Summit Cabin', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80', 520, 4.8, 'Montego Bay, Jamaica', '/night', '$10,400/total', array['Entire place','Cabin','Country Side'], '{"bedrooms":3,"beds":3,"bathrooms":1}', '[{"label":"3 bed"},{"label":"1 bath"}]'),
  ('moonlit-timber-haven', 'airbnb', 'Moonlit Timber Haven', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80', 540, 4.8, 'Montego Bay, Jamaica', '/night', '$10,800/total', array['Entire place','Cabin','Country Side'], '{"bedrooms":3,"beds":3,"bathrooms":2}', '[{"label":"3 bed"},{"label":"2 bath"}]'),
  ('crystal-lake-hideout', 'airbnb', 'Crystal Lake Hideout', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', 620, 4.8, 'Montego Bay, Jamaica', '/night', '$12,400/total', array['Entire place','House','Lake Front'], '{"bedrooms":4,"beds":4,"bathrooms":2}', '[{"label":"4 bed"},{"label":"2 bath"}]'),
  ('sunset-valley-retreat', 'airbnb', 'Sunset Valley Retreat', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80', 510, 4.8, 'Montego Bay, Jamaica', '/night', '$10,200/total', array['Entire place','House','Farm Houses'], '{"bedrooms":3,"beds":3,"bathrooms":1}', '[{"label":"3 bed"},{"label":"1 bath"}]'),
  ('oceanview-villa', 'airbnb', 'Oceanview Villa', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80', 620, 4.8, 'Montego Bay, Jamaica', '/night', '$12,400/total', array['Entire place','Villa','Tiny Homes'], '{"bedrooms":3,"beds":3,"bathrooms":1}', '[{"label":"3 bed"},{"label":"1 bath"}]'),

  ('half-moon-resort', 'hotel', 'Half Moon Resort', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80', 420, 4.9, 'Rose Hall, Montego Bay', '/night', '$8,400/total', array['Hotel','Resort','Luxury','Swimming pool','Breakfast included'], '{"starRating":5,"rooms":2}', '[{"label":"5 star"},{"label":"2 rooms"}]'),
  ('secrets-st-james', 'hotel', 'Secrets St. James', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80', 380, 4.8, 'Freeport, Montego Bay', '/night', '$7,600/total', array['Hotel','Resort','Luxury','All-inclusive','Swimming pool'], '{"starRating":5,"rooms":2}', '[{"label":"5 star"},{"label":"All-inclusive"}]'),
  ('riu-montego-bay', 'hotel', 'Riu Montego Bay', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80', 290, 4.6, 'Ironshore, Montego Bay', '/night', '$5,800/total', array['Hotel','Resort','Beachfront','All-inclusive','Swimming pool','Airport shuttle'], '{"starRating":4,"rooms":2}', '[{"label":"4 star"},{"label":"Beachfront"}]'),
  ('deja-resort', 'hotel', 'Deja Resort', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80', 185, 4.5, 'Gloucester Ave, Montego Bay', '/night', '$3,700/total', array['Hotel','Resort','Budget','Breakfast included'], '{"starRating":3,"rooms":1}', '[{"label":"3 star"},{"label":"1 room"}]'),
  ('s-hotel-montego-bay', 'hotel', 'S Hotel Montego Bay', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80', 310, 4.7, 'Jimmy Cliff Blvd, Montego Bay', '/night', '$6,200/total', array['Hotel','Boutique','Luxury','Airport shuttle'], '{"starRating":4,"rooms":1}', '[{"label":"4 star"},{"label":"Boutique"}]'),
  ('holiday-inn-resort', 'hotel', 'Holiday Inn Resort', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80', 220, 4.4, 'Rose Hall, Montego Bay', '/night', '$4,400/total', array['Hotel','Resort','Budget','Swimming pool','Breakfast included'], '{"starRating":4,"rooms":2}', '[{"label":"4 star"},{"label":"Pool"}]'),

  ('scotchies-jerk-centre', 'food', 'Scotchies Jerk Centre', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80', 18, 4.9, 'Drumblair Rd, Montego Bay', '/meal', '$360/total', array['Jamaican','Gluten-free','Open now'], '{}', '[{"label":"Jerk"},{"label":"30 min"}]'),
  ('pelican-grill', 'food', 'The Pelican Grill', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80', 45, 4.8, 'Gloucester Ave, Montego Bay', '/meal', '$900/total', array['Seafood','Gluten-free','Accepts reservations'], '{}', '[{"label":"Seafood"},{"label":"45 min"}]'),
  ('margaritaville-montego-bay', 'food', 'Margaritaville Montego Bay', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 32, 4.6, 'Hip Strip, Montego Bay', '/meal', '$640/total', array['Jamaican','Vegetarian','Open now','Accepts reservations'], '{}', '[{"label":"American"},{"label":"40 min"}]'),
  ('pier-one-seafood', 'food', 'Pier One Seafood', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80', 55, 4.7, 'Howard Cooke Blvd, Montego Bay', '/meal', '$1,100/total', array['Seafood','Fine Dining','Gluten-free','Accepts reservations'], '{}', '[{"label":"Seafood"},{"label":"Fine dining"}]'),
  ('juici-patties', 'food', 'Juici Patties', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', 8, 4.5, 'Fairview, Montego Bay', '/meal', '$160/total', array['Jamaican','Street Food','Vegetarian','Open now'], '{}', '[{"label":"Street food"},{"label":"15 min"}]'),
  ('evitas-italian-restaurant', 'food', 'Evita''s Italian Restaurant', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80', 38, 4.8, 'Edgewater Dr, Montego Bay', '/meal', '$760/total', array['Italian','Vegetarian','Vegan','Accepts reservations'], '{}', '[{"label":"Italian"},{"label":"50 min"}]'),

  ('toyota-corolla-2024', 'transport', 'Toyota Corolla 2024', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80', 45, 4.9, 'Sangster Intl Airport, Montego Bay', '/day', '$900/total', array['Sedan','Automatic','Air conditioning','Unlimited mileage','Airport pickup'], '{"seats":5,"luggage":2}', '[{"label":"Sedan"},{"label":"5 seats"}]'),
  ('honda-crv-suv', 'transport', 'Honda CR-V SUV', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80', 65, 4.7, 'Rose Hall, Montego Bay', '/day', '$1,300/total', array['SUV','Automatic','Air conditioning','Unlimited mileage'], '{"seats":7,"luggage":4}', '[{"label":"SUV"},{"label":"7 seats"}]'),
  ('mercedes-benz-e-class', 'transport', 'Mercedes-Benz E-Class', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80', 120, 4.9, 'Ironshore, Montego Bay', '/day', '$2,400/total', array['Sedan','Luxury','Automatic','Air conditioning','Airport pickup'], '{"seats":5,"luggage":3}', '[{"label":"Luxury"},{"label":"Auto"}]'),
  ('toyota-hiace-van', 'transport', 'Toyota Hiace Van', 'https://images.unsplash.com/photo-1544627669-8a4e3e4a4b4e?auto=format&fit=crop&w=900&q=80', 85, 4.6, 'Downtown Montego Bay', '/day', '$1,700/total', array['Van','Automatic','Air conditioning','Airport pickup'], '{"seats":12,"luggage":6}', '[{"label":"Van"},{"label":"12 seats"}]'),
  ('nissan-sentra', 'transport', 'Nissan Sentra', 'https://images.unsplash.com/photo-1494976388531-d1058498ceb8?auto=format&fit=crop&w=900&q=80', 38, 4.5, 'Freeport, Montego Bay', '/day', '$760/total', array['Sedan','Economy','Automatic','Air conditioning','Unlimited mileage'], '{"seats":5,"luggage":2}', '[{"label":"Economy"},{"label":"5 seats"}]'),
  ('jeep-wrangler-4x4', 'transport', 'Jeep Wrangler 4x4', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80', 95, 4.8, 'Falmouth Road, Montego Bay', '/day', '$1,900/total', array['SUV','Automatic','Air conditioning','Unlimited mileage'], '{"seats":4,"luggage":2}', '[{"label":"4x4"},{"label":"4 seats"}]')
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  image_url = excluded.image_url,
  price = excluded.price,
  rating = excluded.rating,
  subtitle = excluded.subtitle,
  price_suffix = excluded.price_suffix,
  total_price = excluded.total_price,
  filter_tags = excluded.filter_tags,
  filter_values = excluded.filter_values,
  meta = excluded.meta,
  updated_at = now();
