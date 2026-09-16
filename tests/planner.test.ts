import assert from "node:assert/strict";
import { test } from "node:test";
import { estimatePlan, money, planPath, readPlan } from "../lib/planner/plan";

test("an empty plan supplies a complete default itinerary", () => {
  assert.deepEqual(readPlan({}), {
    destination: "Montego Bay, Jamaica", days: 3, travelers: 2,
    budget: 1000, stay: 150, food: 30, transport: 40,
  });
});

test("plan parameters use the first value and trim the destination", () => {
  const plan = readPlan({ destination: ["  Kingston  ", "Negril"], days: ["5", "7"], travelers: [] });
  assert.equal(plan.destination, "Kingston");
  assert.equal(plan.days, 5);
  assert.equal(plan.travelers, 2);
  assert.equal(readPlan({ destination: "  " }).destination, "Montego Bay, Jamaica");
  assert.equal(readPlan({ destination: "x".repeat(101) }).destination.length, 100);
});

for (const value of ["", "  ", "invalid", "NaN", "Infinity", "-Infinity"]) {
  test(`invalid numeric plan input ${JSON.stringify(value)} uses defaults`, () => {
    assert.deepEqual(readPlan({ days: value, travelers: value, budget: value, stay: value, food: value, transport: value }), readPlan({}));
  });
}

test("plan amounts and trip sizes are rounded and constrained to supported bounds", () => {
  assert.deepEqual(readPlan({ days: "-1", travelers: "0", budget: "-5", stay: "-1", food: "-1", transport: "-1" }), {
    ...readPlan({}), days: 1, travelers: 1, budget: 1, stay: 0, food: 0, transport: 0,
  });
  assert.deepEqual(readPlan({ days: "100", travelers: "100", budget: "100001", stay: "10001", food: "1001", transport: "10001" }), {
    ...readPlan({}), days: 7, travelers: 12, budget: 100000, stay: 10000, food: 1000, transport: 10000,
  });
  assert.equal(readPlan({ days: " 4.5 " }).days, 5);
  assert.equal(readPlan({ budget: "12.4" }).budget, 12);
});

test("estimates charge stays per night, food per traveler, and transport per day", () => {
  assert.deepEqual(estimatePlan(readPlan({})), {
    nights: 2, stay: 300, food: 180, transport: 120, total: 600, remaining: 400,
  });
});

test("single-day trips have no overnight charge and can exceed their budget", () => {
  assert.deepEqual(estimatePlan(readPlan({ days: "1", budget: "50" })), {
    nights: 0, stay: 0, food: 60, transport: 40, total: 100, remaining: -50,
  });
});

test("zero-cost plans preserve the full budget", () => {
  assert.deepEqual(estimatePlan(readPlan({ stay: "0", food: "0", transport: "0" })), {
    nights: 2, stay: 0, food: 0, transport: 0, total: 0, remaining: 1000,
  });
});

test("shared plan URLs round-trip all values and encode destination punctuation", () => {
  const plan = readPlan({ destination: "Ocho Rios & café #1?", days: "5", travelers: "4", budget: "2300", stay: "180", food: "45", transport: "60" });
  const url = new URL(planPath(plan), "https://example.com");
  assert.equal(url.pathname, "/plan");
  assert.equal(url.hash, "");
  assert.equal(url.searchParams.size, 7);
  assert.deepEqual(readPlan(Object.fromEntries(url.searchParams)), plan);
});

test("money displays whole US dollars with grouping and negative balances", () => {
  assert.equal(money(1234.6), "$1,235");
  assert.equal(money(0), "$0");
  assert.equal(money(-50), "-$50");
});
