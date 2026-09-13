This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase setup

1. Create a Supabase project.
2. Open the project SQL Editor and run the files in `supabase/migrations/` in filename order.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project Connect dialog.
5. Start the app with `npm run dev`.

The migrations create and seed `public.listings`, enable row-level security, grant public read access only to published listings, and create the paginated `search_listings` database function used by the search and filter UI.

## Provider profiles and driver dashboard

Sign in and open `/host/profiles` to choose Driver, Hotel Owner, Car Rental Company, Airbnb Owner, or Restaurant Owner. Each account can save one provider type. Business details remain editable; the provider type cannot be changed through the app or public API. Traveler bookings remain available under `/profile`.

Drivers can open `/driver` from the profile menu to manage services and bookings. Create a service through `/host/onboarding`, then publish, pause, or edit it in **My services**. Transport pricing uses the existing daily booking model. Earlier transport listings can be linked from the Driver profile.

**Bookings** supports search, pickup-date and status filters, confirmation of pending bookings, starting and completing trips, and cancellation before a trip starts. Cancellation updates the traveler’s reservation; it does not process a refund. Dashboard service values exclude cancelled bookings and platform fees and are not payout balances. Times are displayed in `America/Jamaica`.

The provider and dashboard migrations enforce account ownership and valid trip transitions. Drivers can update only booking status and trip progress, not prices or payment records. The SQL checks in `supabase/tests/` run within transactions and roll back all test fixtures. Application checks:

```bash
node_modules/.bin/jiti tests/provider-profiles.test.ts
node_modules/.bin/jiti tests/driver-dashboard.test.ts
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
