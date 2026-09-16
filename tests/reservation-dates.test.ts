import assert from "node:assert/strict";
import { test } from "node:test";
import { reservationDates } from "../lib/reservations/dates";

for (const category of ["hotel", "airbnb", "transport"]) {
  test(`${category} uses the correct local pickup/check-in and checkout hours`, () => {
    const dates = reservationDates(category, "2030-06-10", "2030-06-12", "08:00");
    assert.ok(dates);
    assert.equal(dates.startsAt.getTime(), new Date(2030, 5, 10, 15).getTime());
    assert.equal(dates.endsAt?.getTime(), new Date(2030, 5, 12, category === "transport" ? 10 : 11).getTime());
  });
  test(`${category} requires an end date later than its start`, () => {
    for (const end of ["", "2030-06-09", "2030-06-10"]) {
      assert.equal(reservationDates(category, "2030-06-10", end, ""), null);
    }
  });
}

test("dining accepts an exact reservation time without an end date", () => {
  const dates = reservationDates("food", "2030-06-10", "", "19:30");
  assert.ok(dates);
  assert.equal(dates.startsAt.getTime(), new Date(2030, 5, 10, 19, 30).getTime());
  assert.equal(dates.endsAt, null);
});

for (const time of ["00:00", "23:59"]) {
  test(`dining accepts the valid clock boundary ${time}`, () => {
    assert.ok(reservationDates("food", "2030-06-10", "", time));
  });
}

for (const time of ["", "9:30", "24:00", "12:60", "-1:00", "12:30:00", " 12:30"]) {
  test(`dining rejects invalid clock ${JSON.stringify(time)}`, () => {
    assert.equal(reservationDates("food", "2030-06-10", "", time), null);
  });
}

for (const date of ["", "2030-02-29", "2030-02-30", "2030-04-31", "2030-00-01", "2030-13-01", "2030-06-00", "2030-6-10", "not-a-date"]) {
  test(`reservations reject malformed or impossible date ${JSON.stringify(date)}`, () => {
    assert.equal(reservationDates("hotel", date, "2031-01-01", ""), null);
    assert.equal(reservationDates("hotel", "2029-01-01", date, ""), null);
  });
}

test("calendar validation accepts leap days and year boundaries", () => {
  assert.ok(reservationDates("hotel", "2032-02-29", "2032-03-01", ""));
  assert.ok(reservationDates("hotel", "2030-12-31", "2031-01-01", ""));
});

test("optional dining end dates must be valid and strictly after the reservation", () => {
  assert.ok(reservationDates("food", "2030-06-10", "2030-06-11", "19:30"));
  assert.equal(reservationDates("food", "2030-06-10", "2030-06-10", "11:00"), null);
  assert.equal(reservationDates("food", "2030-06-10", "2030-06-10", "19:30"), null);
  assert.equal(reservationDates("food", "2030-06-10", "2030-06-31", "19:30"), null);
});
