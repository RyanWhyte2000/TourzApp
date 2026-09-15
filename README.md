This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase setup

1. Create a Supabase project.
2. Open the project SQL Editor and run the files in `supabase/migrations/` in filename order.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project Connect dialog.
5. Start the app with `npm run dev`.

The migrations create and seed `public.listings`, enable row-level security, grant public read access only to published listings, and create the paginated `search_listings` database function used by the search and filter UI.

## Provider profiles and dashboards

Sign in and open `/host/profiles` to choose Driver, Hotel Owner, Car Rental Company, Airbnb Owner, or Restaurant Owner. Each account can add all five categories, with one profile per category and multiple listings per profile. Use Your businesses to add categories and switch dashboards; listing creation keeps the selected provider category. Business details remain editable; the provider type cannot be changed through the app or public API. Traveler bookings remain available under `/profile`.

Open `/host/dashboard` to reach the dashboard for the signed-in account’s provider type. Dashboard links also appear in the account menu, traveler profile, and provider profile.

| Provider | Dashboard | Listing controls | Booking workflow |
| --- | --- | --- | --- |
| Driver | `/driver` | Services, daily prices, seats, luggage | Start / complete trip |
| Hotel Owner | `/host/dashboard/hotel_owner` | Hotel listings, nightly prices, rooms, star rating | Check in / check out guests |
| Car Rental Company | `/host/dashboard/car_rental` | Rental fleet, daily prices, seats, luggage | Hand over / return vehicle |
| Airbnb Owner | `/host/dashboard/airbnb_owner` | Vacation rentals, nightly prices, bedrooms, beds, bathrooms | Check in / check out guests |
| Restaurant Owner | `/host/dashboard/restaurant_owner` | Dining listings, per-person prices, party size | Seat party / complete dining |

Each dashboard includes booking search, date/status filters, activity totals, listing editing, publishing, and pausing new bookings. Create listings through `/host/onboarding`. Earlier listings can be linked from the provider profile. One provider type per account is enforced in the database; visiting another type’s dashboard redirects to the account’s own dashboard.

Providers can confirm pending reservations and cancel before service begins. Cancellation updates the traveler’s reservation but does not process a refund. Dashboard service values exclude cancelled bookings and platform fees and are not payout balances. Times are displayed in `America/Jamaica`.

The migrations restrict providers to their own listings and bookings and allow only booking status/progress updates, never changes to booking prices or payment records. The shared fulfillment stage retains the `driver_status` database column for compatibility with the original Driver dashboard.

SQL checks under `supabase/tests/` run within transactions and roll back every fixture. Application checks:

```bash
node_modules/.bin/jiti tests/provider-profiles.test.ts
node_modules/.bin/jiti tests/driver-dashboard.test.ts
node_modules/.bin/jiti tests/provider-dashboards.test.ts
node --test tests/provider-dashboard-render.test.mjs
node --test tests/bug-regressions.mjs
npm run lint
npm run build
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Consistency and network failures

Authoritative data favors consistency during database outages. Checkout retries reuse a persistent reservation ID to prevent duplicate bookings after lost responses. See [the consistency policy](docs/consistency.md) for behavior, verification, and deployment limits.
