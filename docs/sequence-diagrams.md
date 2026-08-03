# Tourz Sequence Diagrams

These diagrams are based on the current app structure in `app/`, `lib/listings/queries.tsx`, and `lib/supabase/server.ts`.

## 1. Browse Listings From Home Or Category Page

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant NextPage as Next.js Page
    participant PageShell
    participant CategoryView as AirBnb/Hotel/Food/Transport
    participant QueryLayer as getListings + getCategoryCounts
    participant SupabaseClient as Server Supabase Client
    participant Supabase

    User->>Browser: Open `/` or `/airbnb`, `/hotel`, `/food`, `/transport`
    Browser->>NextPage: Request route with search params
    NextPage->>PageShell: Render shell + header + search panel
    NextPage->>CategoryView: Pass resolved `searchParams`
    CategoryView->>QueryLayer: Request listings and category counts in parallel
    par Listings query
        QueryLayer->>SupabaseClient: createServerSupabaseClient()
        SupabaseClient-->>QueryLayer: Client instance
        QueryLayer->>Supabase: RPC `search_listings(...)`
        Supabase-->>QueryLayer: Paginated items + totalCount
    and Category counts
        QueryLayer->>SupabaseClient: createServerSupabaseClient()
        SupabaseClient-->>QueryLayer: Client instance
        loop For each category rail label
            QueryLayer->>Supabase: Count published listings with matching tag
            Supabase-->>QueryLayer: Count
        end
    end
    QueryLayer-->>CategoryView: Listings result + category counts
    CategoryView->>NextPage: Build `ListingLayout` props
    NextPage-->>Browser: HTML for cards, filters, pagination, and rail
    Browser-->>User: Render listing results page
```

## 2. Submit Search From Search Panel

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant SearchPanel
    participant CategoryForm as CategorySearchForm
    participant Router as Next Router
    participant NextPage as Next.js Page
    participant QueryLayer as getListings
    participant Supabase

    User->>SearchPanel: Enter location, dates, and quantity
    User->>CategoryForm: Submit form
    CategoryForm->>CategoryForm: Prevent default submit
    CategoryForm->>CategoryForm: Clear category-specific params and `page`
    CategoryForm->>CategoryForm: Build params for active category
    CategoryForm->>Router: `router.push(resultsPath + queryString)`
    Router->>NextPage: Navigate to updated URL
    NextPage->>QueryLayer: Fetch listings for new search state
    QueryLayer->>Supabase: RPC `search_listings(...)`
    Supabase-->>QueryLayer: Matching listings
    QueryLayer-->>NextPage: Items + total count + page metadata
    NextPage-->>SearchPanel: Re-render page with new state
    SearchPanel-->>User: Show refreshed search results
```

## 3. Open A Listing Detail Page

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant DetailPage as `[id]/page.tsx`
    participant Metadata as `generateMetadata`
    participant QueryLayer as getListing
    participant SupabaseClient as Server Supabase Client
    participant Supabase
    participant ListingDetail

    User->>Browser: Click listing card
    Browser->>DetailPage: Request `/category/:id`
    DetailPage->>Metadata: Resolve page title
    Metadata->>QueryLayer: `getListing(category, id)`
    QueryLayer->>SupabaseClient: createServerSupabaseClient()
    SupabaseClient-->>QueryLayer: Client instance
    QueryLayer->>Supabase: Select listing by category, id, published status
    Supabase-->>QueryLayer: Listing row or null
    QueryLayer-->>Metadata: Listing or null
    Metadata-->>DetailPage: Title metadata

    DetailPage->>QueryLayer: `getListing(category, id)`
    QueryLayer-->>DetailPage: Cached listing or null

    alt Listing found
        DetailPage->>ListingDetail: Render detail UI
        ListingDetail-->>Browser: Hero image, pricing, highlights, CTA
        Browser-->>User: Display listing detail page
    else Listing missing
        DetailPage->>Browser: `notFound()`
        Browser-->>User: Show 404 state
    end
```

## 4. Mobile Search Drawer Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant MobileHeader as Mobile Header
    participant Drawer as Base UI Drawer
    participant SearchPanel
    participant CategoryForm as CategorySearchForm
    participant Router as Next Router

    User->>MobileHeader: Tap search icon
    MobileHeader->>Drawer: Set `isSearchOpen = true`
    Drawer-->>User: Present search drawer
    User->>SearchPanel: Fill search fields
    User->>CategoryForm: Submit search
    CategoryForm->>Router: Push updated URL
    CategoryForm->>MobileHeader: Call `onSearchComplete()`
    MobileHeader->>Drawer: Set `isSearchOpen = false`
    Drawer-->>User: Close drawer while route updates
```

## Notes

- The home page currently routes through `app/page.tsx` and renders the Airbnb results experience by default.
- Listing search uses the `search_listings` Supabase RPC for paginated results.
- Listing detail pages use `getListing(...)` and return `notFound()` when no published record exists.
- Search behavior differs slightly by category:
  - `transport` uses `pickup`, `dropoff`, `pickupDate`, and `returnDate`
  - `food` uses `where`, `date`, `time`, and `partySize`
  - `hotel` uses `where`, `checkIn`, `checkOut`, and `rooms`
  - `airbnb` uses `where`, `checkIn`, `checkOut`, and `guests`
