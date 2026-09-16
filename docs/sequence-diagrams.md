# Tourz Sequence Diagrams

These Mermaid sequence flows describe the implemented TourzApp journeys. Open this document in a Mermaid-enabled Markdown viewer to see the diagrams.

Flows 1–6 cover discovery, search, authentication, and wishlists; 7 covers checkout and safe retries; 8–9 cover listing creation and settings; 10–13 cover provider profiles, dashboards, listing availability, and booking fulfillment.

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

## 7. Complete A Reservation And Retry Safely

Source: `app/checkout/[category]/[id]/page.tsx`, `app/checkout/actions.ts`, `lib/reservations/attempt.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Traveler
    participant Checkout as Checkout page / form
    participant Auth as Supabase Auth
    participant Action as createReservation
    participant DB as Supabase database
    participant Confirmation as Reservation page

    Traveler->>Checkout: Open checkout for a listing
    opt Missing or invalid attempt UUID
        Checkout-->>Traveler: Redirect to checkout URL with new attempt UUID
        Traveler->>Checkout: Open URL with persistent attempt UUID
    end
    Checkout->>Auth: Verify signed-in user
    alt No authenticated user
        Checkout-->>Traveler: Redirect to login, preserving checkout URL
    else Authenticated
        Checkout->>DB: Find reservation by attempt ID, user, and listing
        alt Reservation already exists
            Checkout-->>Traveler: Redirect to existing reservation
        else No existing reservation
            Checkout->>DB: Load published listing
            Checkout-->>Traveler: Show checkout or 404 if missing
            Traveler->>Action: Submit details, pay_later, and same attempt ID
            Action->>Action: Validate attempt, payment option, dates, category, and party size
            Action->>Auth: Verify user again
            Action->>DB: Find existing reservation for this attempt
            alt Existing reservation found
                DB-->>Action: Existing reservation ID
            else No existing reservation
                Action->>DB: Re-fetch published listing and authoritative price
                Action->>Action: Calculate totals from validated dates and listing price
                Note over Action: Stays and transport use duration plus 8% fee.<br/>Food subtotal, fee, and total are zero.
                Action->>DB: Insert with attempt UUID as primary key
                Note over Action,DB: status=confirmed, payment_method=pay_later,<br/>payment_status=not_charged
                alt Insert succeeds
                    DB-->>Action: Reservation ID
                else Insert returns error or missing result
                    Action->>DB: Recheck attempt ID, user, and listing
                    DB-->>Action: Existing ID, no match, or lookup error
                end
            end
            alt Reservation ID established
                Action-->>Confirmation: Redirect to reservation
                Confirmation-->>Traveler: Show reservation details
            else Outcome unknown or network exception
                Action-->>Traveler: Retry from same checkout or check My reservations
                Note over Traveler,DB: Reloads and retries retain the attempt ID.<br/>Primary key prevents duplicate insertion; existing rows are never overwritten.
            end
        end
    end
    Note over Action,DB: Validation, authentication, or availability failures return an error before insertion.<br/>A published listing check does not implement inventory locking or payment collection.
```

## 8. Create A Host Listing Draft

Source: `app/host/onboarding/actions.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Host
    participant Form as Host onboarding
    participant Action as createHostListing
    participant Auth as Supabase Auth
    participant DB as Supabase database

    Host->>Form: Choose provider category and enter listing details
    Form->>Action: Submit form
    Action->>Auth: Verify current user
    Action->>DB: Load user's profile for selected provider type
    alt Not signed in, profile missing, or category mismatch
        Action-->>Form: Return error
    else Profile and category valid
        Action->>Action: Validate content, image URL, and price
        Note over Action: Food listings use price zero.
        alt Invalid details
            Action-->>Form: Return validation error
        else Valid details
            Action->>Action: Generate slug, category filters, and metadata
            Action->>DB: Insert draft with owner_id and provider_profile_id
            alt Insert fails
                Action-->>Form: Return creation error
            else Insert succeeds
                DB-->>Action: Listing ID
                Action->>Action: Revalidate provider profile page
                Action-->>Host: Redirect to /host/listings/:id
            end
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

## 10. Create Or Edit A Provider Profile

Source: `app/host/profiles/actions.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Provider
    participant Form as Provider profile form
    participant Action as saveProviderProfile
    participant Auth as Supabase Auth
    participant DB as Supabase database

    Provider->>Form: Choose business category and submit details
    Form->>Action: Submit profile
    Action->>Auth: Verify user
    Action->>Action: Validate provider type and business fields
    alt Authentication or validation fails
        Action-->>Form: Return error
    else Valid request
        Action->>DB: Find profile by user_id and provider_type
        alt Lookup fails
            Action-->>Form: Return load error
        else Existing profile
            Action->>DB: Update business fields on owned profile
        else New category
            Action->>DB: Insert owned profile with provider_type
        end
        opt Save attempted
            alt Save fails
                Action-->>Form: Return save error
            else Saved
                Action->>Action: Revalidate profiles, traveler profile, and dashboards
                Action-->>Form: Provider profile saved
            end
        end
    end
    Note over Provider,DB: One account can have multiple categories.<br/>Editing a profile does not change its provider type.
```

## 11. Open And Switch Provider Dashboards

Source: `app/host/dashboard/page.tsx`, `app/host/dashboard/[type]/page.tsx`, `lib/providers/account.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Provider
    participant Page as Dashboard route
    participant Account as getProviderAccount
    participant Auth as Supabase Auth
    participant DB as Supabase database

    Provider->>Page: Open dashboard or select a business category
    Page->>Account: Resolve account and selected profile
    Account->>Auth: Verify user
    Account->>DB: Load user's provider profiles ordered by creation
    Account-->>Page: User, selected profile, profiles, or error
    alt Not signed in
        Page-->>Provider: Redirect to login with return path
    else Profile lookup fails
        Page-->>Provider: Show error state
    else No matching profile
        Page-->>Provider: Redirect to profile setup
    else Entry route or driver profile
        Page-->>Provider: Redirect to category dashboard or /driver
    else Selected non-driver dashboard
        par Load listings
            Page->>DB: Select owned listings for selected profile and category
        and Load bookings
            Page->>DB: Select reservations joined to selected profile's listings
        end
        alt Either query fails
            Page-->>Provider: Show dashboard error
        else Queries succeed
            Page-->>Provider: Render listings, bookings, totals, and profile switcher
        end
    end
```

## 12. Edit, Publish, Or Pause A Provider Listing

Source: `app/host/dashboard/actions.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Provider
    participant Controls as Dashboard listing controls
    participant Action as Provider listing action
    participant Account as getProviderAccount
    participant DB as Supabase database

    Provider->>Controls: Save edits, publish, or pause listing
    Controls->>Action: Submit provider type, listing ID, and changes
    Action->>Account: Verify signed-in user and provider profile
    alt Invalid type or unavailable account/profile
        Action-->>Controls: Return error
    else Authorized profile
        alt Edit listing
            Action->>Action: Validate category-specific fields
            Action->>DB: Load existing owned listing within profile and category
            Action->>DB: Update fields and merge category filters
        else Publish or pause
            Action->>Action: Accept only published or archived status
            Action->>DB: Update status scoped to owner, profile, and category
        end
        alt Validation, lookup, or write fails
            Action-->>Controls: Return error
        else Write succeeds
            Action->>Action: Revalidate dashboard, profile, and listing pages
            Action-->>Controls: Show success
        end
    end
    Note over Controls,DB: Pausing sets status to archived.<br/>Existing reservations remain unchanged.
```

## 13. Confirm, Start, Complete, Or Cancel A Booking

Source: `app/host/dashboard/actions.ts`, `lib/driver/types.ts`. The Driver dashboard has corresponding actions in `app/driver/actions.ts`.

```mermaid
sequenceDiagram
    autonumber
    actor Provider
    participant Controls as Booking controls
    participant Action as updateProviderBooking
    participant Account as getProviderAccount
    participant DB as Supabase database

    Provider->>Controls: Choose booking action
    Controls->>Action: Submit booking ID, provider type, and action
    Action->>Account: Verify signed-in user and selected profile
    Action->>DB: Load booking joined to selected profile's listing
    alt Unauthorized or booking unavailable
        Action-->>Controls: Return error
    else Booking found
        Action->>Action: Validate transition from current status and driver_status
        Note over Action: Confirm: pending + scheduled to confirmed.<br/>Start: confirmed + scheduled to in_progress.<br/>Complete: confirmed + in_progress to completed.<br/>Cancel: scheduled to cancelled.<br/>Cancelled or completed bookings reject further changes.
        alt Transition invalid
            Action-->>Controls: Ask provider to refresh
        else Transition valid
            Action->>DB: Update matching ID, listing ID, and previously read statuses
            alt Write fails or statuses changed concurrently
                Action-->>Controls: Ask provider to refresh and retry
            else Updated
                Action->>Action: Revalidate provider views, traveler profile, and reservation
                Action-->>Controls: Booking updated
            end
        end
    end
    Note over Provider,DB: Service progress is stored in driver_status for every provider type.<br/>Cancellation does not process a refund or alter payment records.
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
