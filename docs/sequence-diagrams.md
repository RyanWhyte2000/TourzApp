# Tourz Sequence Diagrams

These diagrams are based on the current app structure in `app/`, `lib/listings/`, `lib/wishlist/`, and `lib/supabase/`.

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

## 5. Sign In And OAuth Callback

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant AuthForm
    participant AuthAction as Auth Server Action
    participant AuthClient as Auth Supabase Client
    participant SupabaseAuth as Supabase Auth
    participant OAuth as Google OAuth
    participant Callback as `/auth/callback`
    participant Browser

    alt Email and password
        User->>AuthForm: Submit credentials
        AuthForm->>AuthAction: `login(formData)`
        AuthAction->>AuthAction: Validate email, password, and safe `next` path
        AuthAction->>AuthClient: Create cookie-aware client
        AuthClient->>SupabaseAuth: `signInWithPassword(...)`
        alt Credentials accepted
            SupabaseAuth-->>AuthAction: Authenticated session
            AuthAction-->>Browser: Redirect to safe `next` path
        else Credentials rejected
            SupabaseAuth-->>AuthAction: Authentication error
            AuthAction-->>AuthForm: Return user-friendly error
            AuthForm-->>User: Display error message
        end
    else Google OAuth
        User->>AuthForm: Continue with Google
        AuthForm->>AuthAction: `signInWithGoogle(formData)`
        AuthAction->>SupabaseAuth: Request OAuth URL with callback
        SupabaseAuth-->>Browser: Redirect to Google
        Browser->>OAuth: Authenticate and grant access
        OAuth-->>Callback: Redirect with authorization code
        Callback->>AuthClient: `exchangeCodeForSession(code)`
        alt Exchange succeeds
            AuthClient-->>Callback: Session stored in cookies
            Callback-->>Browser: Redirect to safe `next` path
        else Exchange fails
            Callback-->>Browser: Redirect to `/login?error=...`
        end
    end
```

## 6. Save And Synchronize A Wishlist Item

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FavoriteButton
    participant WishlistStore as Client Wishlist Store
    participant LocalStorage
    participant WishlistAPI as `/api/wishlist`
    participant AuthClient as Auth Supabase Client
    participant Supabase

    User->>FavoriteButton: Toggle heart on a listing
    FavoriteButton->>WishlistStore: `toggle(listingId)`
    WishlistStore->>LocalStorage: Optimistically add or remove ID
    LocalStorage-->>FavoriteButton: Dispatch wishlist change event
    FavoriteButton-->>User: Update heart immediately

    WishlistStore->>WishlistAPI: POST local IDs for initial synchronization
    WishlistAPI->>AuthClient: Get current user
    alt User is authenticated
        AuthClient-->>WishlistAPI: User session
        WishlistAPI->>Supabase: Upsert local IDs into `favorites`
        WishlistAPI->>Supabase: Read account favorites
        Supabase-->>WishlistAPI: Merged favorite IDs
        WishlistAPI-->>WishlistStore: IDs + `authenticated: true`
        WishlistStore->>LocalStorage: Replace with merged IDs
        WishlistStore->>WishlistAPI: PATCH toggled listing state
        WishlistAPI->>Supabase: Upsert or delete favorite row
        alt Database update fails
            Supabase-->>WishlistAPI: Error
            WishlistAPI-->>WishlistStore: Failure response
            WishlistStore->>LocalStorage: Roll back optimistic change
        else Database update succeeds
            Supabase-->>WishlistAPI: Success
            WishlistAPI-->>WishlistStore: Confirm favorite state
        end
    else User is anonymous
        AuthClient-->>WishlistAPI: No user
        WishlistAPI->>Supabase: Load published listings for local IDs
        WishlistAPI-->>WishlistStore: Items + `authenticated: false`
        Note over WishlistStore,LocalStorage: Wishlist remains local to this browser
    end
```

## 7. Complete A Reservation

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant CheckoutPage as Checkout Page
    participant CheckoutForm
    participant ReservationAction as `createReservation`
    participant AuthClient as Auth Supabase Client
    participant Supabase
    participant Confirmation as Reservation Page

    User->>Browser: Choose booking CTA
    Browser->>CheckoutPage: Request `/checkout/:category/:id`
    CheckoutPage->>AuthClient: Get current user
    alt User is not signed in
        AuthClient-->>CheckoutPage: No user
        CheckoutPage-->>Browser: Redirect to login with checkout `next` path
    else User is signed in
        AuthClient-->>CheckoutPage: User session
        CheckoutPage->>Supabase: Load published listing
        Supabase-->>CheckoutPage: Listing details
        CheckoutPage-->>CheckoutForm: Render dates, party size, and price
        User->>CheckoutForm: Enter reservation details
        CheckoutForm->>CheckoutForm: Preview units, subtotal, and 8% fee
        User->>ReservationAction: Confirm reservation
        ReservationAction->>ReservationAction: Validate listing, dates, and party size
        ReservationAction->>AuthClient: Verify current user
        ReservationAction->>Supabase: Re-fetch published listing and authoritative price
        Supabase-->>ReservationAction: Listing row
        ReservationAction->>ReservationAction: Calculate units, subtotal, fee, and total
        ReservationAction->>Supabase: Insert `reservations` row
        alt Insert succeeds
            Supabase-->>ReservationAction: Reservation ID
            ReservationAction-->>Confirmation: Redirect to `/reservations/:id`
            Confirmation-->>User: Show reservation details
        else Validation or insert fails
            ReservationAction-->>CheckoutForm: Return error
            CheckoutForm-->>User: Display error without leaving checkout
        end
    end
```

## 8. Create A Host Listing Draft

```mermaid
sequenceDiagram
    autonumber
    actor Host
    participant OnboardingForm
    participant HostAction as `createHostListing`
    participant AuthClient as Auth Supabase Client
    participant Supabase
    participant DraftPage as Host Listing Page

    Host->>OnboardingForm: Enter business and listing details
    OnboardingForm->>HostAction: Submit form data
    HostAction->>AuthClient: Get current user
    alt Host is not signed in
        AuthClient-->>HostAction: No user
        HostAction-->>OnboardingForm: Return sign-in error
    else Host is signed in
        AuthClient-->>HostAction: User session
        HostAction->>HostAction: Validate category, content, price, and image URL
        HostAction->>HostAction: Generate unique listing slug
        HostAction->>HostAction: Build category filters, metadata, and price suffix
        HostAction->>Supabase: Insert listing with `status = draft`
        alt Draft creation succeeds
            Supabase-->>HostAction: New listing ID
            HostAction->>Supabase: Upsert host settings and service category
            Supabase-->>HostAction: Host settings saved
            HostAction-->>DraftPage: Redirect to `/host/listings/:id`
            DraftPage-->>Host: Display new draft
        else Draft creation fails
            Supabase-->>HostAction: Insert error
            HostAction-->>OnboardingForm: Return migration/setup error
        end
    end
```

## 9. Save Profile, Travel, And Host Settings

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant SettingsForm
    participant SettingsAction as `saveSettings`
    participant AuthClient as Auth Supabase Client
    participant Supabase
    participant NextCache as Next.js Cache

    User->>SettingsForm: Update settings and submit
    SettingsForm->>SettingsAction: Send form data
    SettingsAction->>AuthClient: Get current user
    alt User is not signed in
        AuthClient-->>SettingsAction: No user
        SettingsAction-->>SettingsForm: Return sign-in error
    else User is signed in
        AuthClient-->>SettingsAction: User session
        SettingsAction->>SettingsAction: Normalize profile, preferences, notifications, and host fields
        par Save profile
            SettingsAction->>Supabase: Upsert `profiles`
        and Save travel settings
            SettingsAction->>Supabase: Upsert `user_settings`
        and Save host settings
            SettingsAction->>Supabase: Upsert `host_settings`
        and Update auth metadata
            SettingsAction->>AuthClient: Update user's full name
        end
        alt Any operation fails
            Supabase-->>SettingsAction: Error result
            SettingsAction-->>SettingsForm: Return setup/save error
            SettingsForm-->>User: Display error
        else All operations succeed
            SettingsAction->>NextCache: Revalidate `/settings` and `/profile`
            SettingsAction-->>SettingsForm: Return success
            SettingsForm-->>User: Display “Settings saved”
        end
    end
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
