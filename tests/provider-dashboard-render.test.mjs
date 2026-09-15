import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));
const jiti = createJiti(import.meta.url, { alias: { "@": root }, jsx: { runtime: "automatic" } });
const { default: Dashboard, BookingCard } = jiti("../app/host/dashboard/ProviderDashboard.tsx");
const { default: ListingEditor } = jiti("../app/host/dashboard/ListingEditor.tsx");
const { providerTypes } = jiti("../lib/providers/types.ts");
const { dashboardDefinitions } = jiti("../lib/providers/dashboard.ts");
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const booking = { id: "test-booking", listing_id: "test-listing", starts_at: "2030-09-11T15:00:00Z", ends_at: "2030-09-12T15:00:00Z", party_size: 2, subtotal: 120, status: "confirmed", payment_status: "not_charged", driver_status: "scheduled", notes: "Test notes", listings: { title: "Example listing" } };

for (const type of providerTypes) {
  test(`${type}: dashboard, booking controls, and listing fields render correctly`, () => {
    const definition = dashboardDefinitions[type];
    const profile = { id: "test-profile", user_id: "test-user", provider_type: type, display_name: "Example business", location: "Montego Bay", details: {} };
    const empty = render(Dashboard, { profile, services: [], bookings: [], now: Date.parse("2030-09-01") });
    assert.ok(empty.includes(`${definition.title} workspace`));
    assert.ok(empty.includes(definition.listings));
    assert.ok(empty.includes("No upcoming bookings"));
    const html = render(BookingCard, { type, booking: { ...booking, ends_at: type === "restaurant_owner" ? null : booking.ends_at } });
    assert.ok(html.includes(definition.startAction));
    assert.ok(html.includes(definition.start));
    if (type === "restaurant_owner") assert.ok(!html.includes("$120.00"));
    else assert.ok(html.includes("$120.00"));
    if (type === "restaurant_owner") assert.equal(html.includes(">Return<"), false);
    const active = render(BookingCard, { type, booking: { ...booking, driver_status: "in_progress" } });
    assert.ok(active.includes(definition.completeAction));
    const editor = render(ListingEditor, { type, service: { id: "test-listing", title: "Example listing", description: "Test description", subtitle: "Montego Bay", image_url: "https://example.com/image.jpg", price: 120, status: "draft", filter_values: {} } });
    for (const field of definition.fields) assert.ok(editor.includes(`name="${field.name}"`));
    assert.ok(editor.includes(definition.priceLabel));
  });
}
