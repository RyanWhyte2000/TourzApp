import assert from "node:assert/strict";
import { test } from "node:test";
import { providerTypes, type ProviderType } from "../lib/providers/types";
import { dashboardDefinitions, dashboardHref, bookingLabel, bookingStage, parseProviderListing, type DashboardBooking } from "../lib/providers/dashboard";

function listingForm(type: ProviderType) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ title: "A wonderful listing", description: "A detailed description of this wonderful listing in Jamaica.", subtitle: "Montego Bay", image_url: "https://example.com/photo.jpg", price: "120" })) form.set(key, value);
  for (const field of dashboardDefinitions[type].fields) form.set(field.name, String(field.initial));
  return form;
}

test("each profile has a dedicated dashboard and the correct pricing unit", () => {
  assert.equal(new Set(providerTypes.map(dashboardHref)).size, 5);
  for (const type of providerTypes) {
    const parsed = parseProviderListing(listingForm(type), type);
    assert.equal(parsed.error, undefined);
    assert.equal(parsed.data?.price_suffix, type === "restaurant_owner" ? "" : type === "driver" || type === "car_rental" ? "/day" : "/night");
  }
});

test("only fields belonging to the actual provider type are accepted", () => {
  const form = listingForm("hotel_owner");
  form.set("seats", "20");
  form.set("provider_type", "car_rental");
  const parsed = parseProviderListing(form, "hotel_owner");
  assert.deepEqual(parsed.data?.filter_values, { rooms: 1, starRating: 3 });
  for (const type of providerTypes) {
    const data = listingForm(type);
    const field = dashboardDefinitions[type].fields[0];
    for (const bad of ["", "NaN", "2.5", String(field.max + 1), String(field.min - 1)]) {
      data.set(field.name, bad);
      assert.ok(parseProviderListing(data, type).error);
    }
  }
});

test("booking filters use stable stages while labels match the business", () => {
  const booking = { status: "confirmed", driver_status: "in_progress" } as DashboardBooking;
  for (const type of providerTypes) {
    assert.equal(bookingStage(booking), "in_progress");
    assert.equal(bookingLabel(booking, type), dashboardDefinitions[type].activeLabel);
    assert.equal(bookingLabel({ ...booking, driver_status: "completed" }, type), dashboardDefinitions[type].completedLabel);
    assert.equal(bookingLabel({ ...booking, status: "cancelled" }, type), "Cancelled");
  }
  assert.equal(dashboardDefinitions.restaurant_owner.end, null);
  assert.equal(dashboardDefinitions.hotel_owner.startAction, "Check in guests");
  assert.equal(dashboardDefinitions.car_rental.completeAction, "Mark vehicle returned");
});
