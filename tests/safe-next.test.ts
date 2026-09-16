import assert from "node:assert/strict";
import { test } from "node:test";
import { safeNextPath } from "../lib/auth/safe-next";

for (const path of ["/", "/profile", "/checkout/hotel/one?attempt=123#details", "/plan?destination=Montego%20Bay", "/search?q=https://example.com"]) {
  test(`sign-in redirects preserve local path ${path}`, () => {
    assert.equal(safeNextPath(path), path);
  });
}

for (const path of ["", "profile", "https://evil.example", "//evil.example", "///evil.example", "javascript:alert(1)", "/\\evil.example", "/profile\n", "/\tevil.example", "/\u0000evil.example", "/has space", "/a/..//evil.example"]) {
  test(`unsafe redirect ${JSON.stringify(path)} uses the supplied fallback`, () => {
    assert.equal(safeNextPath(path), "/");
    assert.equal(safeNextPath(path, "/profile"), "/profile");
  });
}

test("local redirect paths normalize dot segments while preserving query and fragment", () => {
  assert.equal(safeNextPath("/host/../profile?tab=bookings#upcoming"), "/profile?tab=bookings#upcoming");
});
