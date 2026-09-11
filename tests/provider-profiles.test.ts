import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProviderProfile } from "../lib/providers/validation";
import { providerTypes } from "../lib/providers/types";

function form(type: string) {
  const data = new FormData();
  data.set("provider_type", type);
  data.set("display_name", "  Island Business  ");
  data.set("location", "Montego Bay");
  return data;
}

test("all five provider types accept valid business details", () => {
  for (const type of providerTypes) {
    const parsed = parseProviderProfile(form(type));
    assert.equal(parsed.error, undefined);
    assert.equal(parsed.data?.provider_type, type);
    assert.equal(parsed.data?.display_name, "Island Business");
  }
});

test("unknown provider types and missing required details are rejected", () => {
  assert.ok(parseProviderProfile(form("admin")).error);
  const data = form("driver");
  data.set("display_name", " ");
  assert.ok(parseProviderProfile(data).error);
  data.set("display_name", "Driver");
  data.set("location", " ");
  assert.ok(parseProviderProfile(data).error);
});

test("driver and car rental details stay separate and extra fields are discarded", () => {
  const data = form("driver");
  data.set("vehicle", "Toyota Hiace");
  data.set("fleet", "Twenty cars");
  data.set("user_id", "someone-else");
  const parsed = parseProviderProfile(data);
  assert.deepEqual(parsed.data?.details, { vehicle: "Toyota Hiace", service_area: "" });
  assert.equal(Object.hasOwn(parsed.data ?? {}, "user_id"), false);
  data.set("provider_type", "car_rental");
  assert.deepEqual(parseProviderProfile(data).data?.details, { fleet: "Twenty cars", pickup_locations: "" });
});

test("contact validation rejects invalid email, unsafe website schemes, and oversized details", () => {
  const data = form("restaurant_owner");
  data.set("contact_email", "invalid");
  assert.ok(parseProviderProfile(data).error);
  data.set("contact_email", "hello@example.com");
  data.set("website", "javascript:alert(1)");
  assert.ok(parseProviderProfile(data).error);
  data.set("website", "https://example.com");
  assert.equal(parseProviderProfile(data).error, undefined);
  data.set("cuisine", "x".repeat(301));
  assert.ok(parseProviderProfile(data).error);
});
