# Consistency and network failures

Tourz favors consistency for authoritative Supabase data. Reads bypass the Next.js
data cache, and each database HTTP request has a ten-second timeout. When the
database cannot be reached, browsing can show an error and mutations cannot claim
success. This deliberately sacrifices availability during a partition.

Reservations use a UUID in the checkout URL as both an attempt identifier and the
reservation primary key. The same URL survives refreshes and sign-in redirects.
Before inserting, checkout checks for an existing reservation belonging to the
signed-in traveler and listing. Concurrent retries are constrained by the database
primary key. After an insert error, checkout reads back the same identifier; a
lost response is not proof that the insert failed. An unresolved outcome is shown
as uncertain, and retrying the same checkout safely recovers the original booking.
Once committed, a retry opens the original booking even if form details changed;
it never overwrites that booking. Starting a new checkout URL is a new intent and
can create another booking. Check My reservations first after an uncertain outcome.

The existing insert trigger calculates prices and payment state in the database.
Provider booking transitions already compare the previously read status and
fulfillment stage in the UPDATE, rejecting concurrent conflicting transitions.
Authorization and ownership remain enforced by the existing RLS policies.

Local wishlist interactions are a separate convenience feature with best-effort
account synchronization, not a guarantee of cross-device consistency. No offline
reservation or payment queue is used.

These application safeguards do not establish a formal CAP guarantee for the
hosting platform. Configure the Supabase URL to use the authoritative primary,
not an asynchronously replicated read endpoint. Replica failover, acknowledged
write durability, and split-brain prevention depend on the database deployment.
Inventory allocation/overbooking limits are not modeled by the current schema;
reservation retry deduplication does not establish inventory exclusivity.

Verification: `node --test tests/reservation-consistency.test.mjs` exercises the
real Supabase query builder against a simulated database transport, including
lost responses, repeated attempts, concurrent inserts, and ownership filters.
It does not simulate a real multi-node database partition.
