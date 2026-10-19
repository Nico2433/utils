import assert from "node:assert/strict";
import { test } from "node:test";
import {
  daysToHours,
  daysToMs,
  hoursToMinutes,
  hoursToMs,
  minutesToMs,
  minutesToSeconds,
  monthsToMs,
  monthsToWeeks,
  secondsToMs,
  weeksToDays,
  weeksToMs,
  yearsToDays,
  yearsToMonths,
  yearsToMs,
} from "../lib";

test("basic time conversions", () => {
  assert.equal(yearsToMonths(2), 24);
  assert.equal(yearsToDays(4), 1461);
  assert.equal(monthsToWeeks(12), 365.25 / 7);
  assert.equal(weeksToDays(2), 14);
  assert.equal(daysToHours(2), 48);
  assert.equal(hoursToMinutes(2), 120);
  assert.equal(minutesToSeconds(2), 120);
  assert.equal(secondsToMs(2), 2000);
});

test("conversions to ms are consistent with each other", () => {
  assert.equal(minutesToMs(1), 60_000);
  assert.equal(hoursToMs(1), 60 * minutesToMs(1));
  assert.equal(daysToMs(1), 86_400_000);
  assert.equal(weeksToMs(1), 7 * daysToMs(1));
  assert.equal(monthsToMs(12), yearsToMs(1));
  assert.equal(yearsToMs(1), daysToMs(365.25));
});
