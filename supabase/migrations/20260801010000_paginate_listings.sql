drop function if exists public.search_listings(text, text, text[], numeric, numeric, numeric, jsonb);

create function public.search_listings(
  p_category text,
  p_destination text default null,
  p_tags text[] default '{}',
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_min_rating numeric default null,
  p_numeric_filters jsonb default '{}',
  p_limit integer default 9,
  p_offset integer default 0
)
returns jsonb
language sql
stable
security invoker
set search_path = public
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
    order by rating desc, created_at desc
    limit greatest(1, least(coalesce(p_limit, 9), 50))
    offset greatest(0, coalesce(p_offset, 0))
  )
  select jsonb_build_object(
    'items', coalesce((select jsonb_agg(to_jsonb(page_rows)) from page_rows), '[]'::jsonb),
    'totalCount', (select count(*) from filtered)
  );
$$;

grant execute on function public.search_listings(text, text, text[], numeric, numeric, numeric, jsonb, integer, integer)
to anon, authenticated;
