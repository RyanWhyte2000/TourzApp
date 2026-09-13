import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingTransition, driverSummary, parseDriverService, type DriverBooking } from "../lib/driver/types";

test("trip progression allows only scheduled → in progress → completed", () => {
  assert.deepEqual(bookingTransition({ status: "confirmed", driver_status: "scheduled" }, "start"), { driver_status: "in_progress" });
  assert.deepEqual(bookingTransition({ status: "confirmed", driver_status: "in_progress" }, "complete"), { driver_status: "completed" });
  assert.equal(bookingTransition({ status: "confirmed", driver_status: "scheduled" }, "complete"), null);
  assert.equal(bookingTransition({ status: "pending", driver_status: "scheduled" }, "start"), null);
  assert.deepEqual(bookingTransition({ status: "pending", driver_status: "scheduled" }, "confirm"), { status: "confirmed" });
});

test("cancellation and terminal states cannot be reversed", () => {
  assert.deepEqual(bookingTransition({ status: "confirmed", driver_status: "scheduled" }, "cancel"), { status: "cancelled" });
  assert.equal(bookingTransition({ status: "confirmed", driver_status: "in_progress" }, "cancel"), null);
  for (const action of ["start", "complete", "confirm", "cancel", "pay"]) {
    assert.equal(bookingTransition({ status: "cancelled", driver_status: "scheduled" }, action), null);
    assert.equal(bookingTransition({ status: "confirmed", driver_status: "completed" }, action), null);
  }
});

test("dashboard totals exclude cancellations and never infer completed trips from dates", () => {
  const base: DriverBooking = { id: "test", listing_id: "service", starts_at: "2026-09-11T15:00:00Z", ends_at: "2026-09-12T15:00:00Z", party_size: 2, subtotal: "100.25", status: "confirmed", driver_status: "scheduled", payment_status: "not_charged", notes: null, listings: { title: "Transfer" } };
  const stats = driverSummary([base, { ...base, status: "cancelled" }, { ...base, driver_status: "completed" }, { ...base, driver_status: "in_progress" }, { ...base, ends_at: "2026-09-01T15:00:00Z" }], Date.parse("2026-09-11T00:00:00Z"));
  assert.deepEqual(stats, { upcoming: 1, inProgress: 1, completed: 1, bookedValue: 401 });
  assert.deepEqual(driverSummary([], Date.now()), { upcoming: 0, inProgress: 0, completed: 0, bookedValue: 0 });
});

test("service edits validate prices, capacity, and image URLs", () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ title: "Private driving service", description: "A comfortable private driving service around Montego Bay.", subtitle: "Montego Bay", image_url: "https://example.com/car.jpg", price: "100", seats: "4", luggage: "2" })) form.set(key, value);
  assert.equal(parseDriverService(form).error, undefined);
  for (const [key, value] of [["price", "NaN"], ["price", "0"], ["seats", "2.5"], ["seats", "31"], ["luggage", "-1"], ["image_url", "javascript:alert(1)"]]) {
    const before = form.get(key)!;
    form.set(key, value);
    assert.ok(parseDriverService(form).error);
    form.set(key, before);
  }
});
