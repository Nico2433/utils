import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  FETCH_STATUS,
  FetchError,
  addToArray,
  assembleString,
  assembleStringWSpaces,
  camelCaseDivider,
  capitalize,
  cleanString,
  compareValues,
  daysToHours,
  daysToMs,
  fetchData,
  filterArray,
  findIndexOnArray,
  findOnArray,
  forEachObj,
  getStatusError,
  hoursToMinutes,
  insertIndexOnArray,
  mapObj,
  mapObjToArr,
  minutesToMs,
  minutesToSeconds,
  monthsToMs,
  monthsToWeeks,
  removeFromArray,
  searchIndexOnArray,
  searchOnArray,
  secondsToMs,
  sortArray,
  weeksToDays,
  weeksToMs,
  yearsToDays,
  yearsToMonths,
  yearsToMs,
} from "../lib";

const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

const ids = (list: { id: number }[]) => list.map((u) => u.id);

test("find works by property and on primitives", () => {
  assert.equal(findOnArray(users, false, "active"), users[1]);
  assert.equal(findOnArray(users, 9, "id"), undefined);
  assert.equal(findOnArray(users, users[2]!), users[2]);
  assert.equal(findOnArray(["a", "b"], "b"), "b");
  assert.equal(findOnArray(["a"], "z"), undefined);
  assert.equal(findIndexOnArray(users, 3, "id"), 2);
  assert.equal(findIndexOnArray(users, 9, "id"), -1);
  assert.equal(findIndexOnArray(["a", "b"], "b"), 1);
});

test("filter compares by property or the items themselves", () => {
  assert.deepEqual(ids(filterArray(users, { by: "id", op: ">=", value: 2 })), [2, 3]);
  assert.deepEqual(ids(filterArray(users, { by: "id", op: ">=", value: 2, exclude: true })), [1]);
  assert.deepEqual(ids(filterArray(users, { by: "active", op: "===", value: true })), [1, 3]);
  assert.deepEqual(filterArray([1, 2, 3, 4], { op: "<", value: 3 }), [1, 2]);
  assert.deepEqual(filterArray([1, 2, 3], { op: "===", value: 2, exclude: true }), [1, 3]);
  assert.deepEqual(filterArray([] as number[], { op: ">", value: 0 }), []);
});

test("binary search by property and on primitives", () => {
  assert.equal(searchOnArray(users, 3, "id"), users[2]);
  assert.equal(searchOnArray(users, 4, "id"), undefined);
  assert.equal(searchOnArray([1, 2, 3], 2), 2);
  assert.equal(searchOnArray([1, 3], 2), undefined);
  assert.equal(searchOnArray([] as number[], 1), undefined);
  assert.equal(searchIndexOnArray(users, 2, "id"), 1);
  assert.equal(searchIndexOnArray(users, 4, "id"), -1);
  assert.equal(searchIndexOnArray([1, 3], 2), -1);
  assert.equal(searchIndexOnArray([1, 3], 0), -1);
});

test("insert index points where a value belongs", () => {
  assert.equal(insertIndexOnArray([] as number[], 1), 0);
  assert.equal(insertIndexOnArray([2, 3], 1), 0);
  assert.equal(insertIndexOnArray([1, 3], 2), 1);
  assert.equal(insertIndexOnArray([1, 2], 3), 2);
  assert.equal(insertIndexOnArray([1, 2], 2), 1);
  assert.equal(insertIndexOnArray(users, 4, "id"), 3);
});

test("add keeps arrays sorted, skips duplicates and does not mutate", () => {
  const nums = [1, 3, 5];
  assert.deepEqual(addToArray(nums, 4), [1, 3, 4, 5]);
  assert.deepEqual(addToArray(nums, 0), [0, 1, 3, 5]);
  assert.deepEqual(addToArray(nums, 9), [1, 3, 5, 9]);
  assert.deepEqual(addToArray(nums, 3), [1, 3, 5]);
  assert.deepEqual(addToArray([], 1), [1]);
  assert.deepEqual(nums, [1, 3, 5]);

  const list = [{ id: 1 }, { id: 3 }];
  assert.deepEqual(ids(addToArray(list, { id: 2 }, "id")), [1, 2, 3]);
  assert.deepEqual(ids(addToArray(list, { id: 3 }, "id")), [1, 3]);
  assert.notEqual(addToArray(list, { id: 3 }, "id"), list);
  assert.deepEqual(ids(list), [1, 3]);
});

test("remove drops the matching item and does not mutate", () => {
  const nums = [1, 2, 3];
  assert.deepEqual(removeFromArray(nums, 2), [1, 3]);
  assert.deepEqual(removeFromArray(nums, 9), [1, 2, 3]);
  assert.notEqual(removeFromArray(nums, 9), nums);
  assert.deepEqual(nums, [1, 2, 3]);

  assert.deepEqual(ids(removeFromArray(users, 2, "id")), [1, 3]);
  assert.equal(users.length, 3);
});

test("sort by property or items, both orders, without mutating", () => {
  const list = [{ n: 2 }, { n: 1 }, { n: 3 }];
  assert.deepEqual(sortArray(list, { by: "n" }).map((x) => x.n), [1, 2, 3]);
  assert.deepEqual(sortArray(list, { by: "n", order: "desc" }).map((x) => x.n), [3, 2, 1]);
  assert.deepEqual(list.map((x) => x.n), [2, 1, 3]);

  const nums = [10, 2, 1];
  assert.deepEqual(sortArray(nums), [1, 2, 10]);
  assert.deepEqual(sortArray(nums, { order: "desc" }), [10, 2, 1]);
  assert.deepEqual(sortArray(["b", "c", "a"]), ["a", "b", "c"]);
  assert.deepEqual(nums, [10, 2, 1]);
});




test("string and object helpers", () => {
  assert.equal(assembleStringWSpaces("a", false, undefined, "b"), "a b");
  assert.equal(camelCaseDivider("helloWorldAgain", true), "Hello world again");
  assert.deepEqual(mapObj({ a: 1, b: 2 }, (v) => v * 2), { a: 2, b: 4 });
});

const realFetch = globalThis.fetch;
afterEach(() => (globalThis.fetch = realFetch));

test("fetchData encodes JSON, keeps caller headers and handles empty bodies", async () => {
  let init: RequestInit | undefined;
  globalThis.fetch = async (_url, i) => ((init = i), new Response(null, { status: 204 }));

  const headers = { authorization: "x" };
  assert.equal(await fetchData("http://x", { method: "PATCH", headers, body: { a: 1 } }), null);
  assert.equal(init?.body, '{"a":1}');
  assert.equal((init?.headers as Record<string, string>)["content-type"], "application/json");
  assert.deepEqual(headers, { authorization: "x" });
  assert.equal(await fetchData("http://x", {}, false), null);
});

test("fetchData throws FetchError on bad status", async () => {
  globalThis.fetch = async () => new Response("nope", { status: 404 });
  await assert.rejects(fetchData("http://x"), /\[Error 404\]: nope/);
});

test("types adapt to the property and reject mismatched values", () => {
  // @ts-expect-error `id` is a number
  findOnArray(users, "1", "id");
  // @ts-expect-error without `by` the value must be a whole item
  findOnArray(users, 1);
  // @ts-expect-error `active` is a boolean
  filterArray(users, { by: "active", op: "===", value: 1 });
  // @ts-expect-error unknown property
  searchOnArray(users, 1, "name");
  // @ts-expect-error numbers array
  findOnArray([1, 2], "2");

  const cap: "Hello" = capitalize("hello");
  const doubled: Record<"a" | "b", string> = mapObj({ a: 1, b: 2 }, (v, { key }) => key + v);
  assert.equal(cap, "Hello");
  assert.deepEqual(doubled, { a: "a1", b: "b2" });
});


test("time conversions are consistent", () => {
  assert.equal(monthsToMs(12), yearsToMs(1));
  assert.equal(daysToMs(1), 86_400_000);
  assert.equal(capitalize("hello world", true), "Hello World");
});

test("fetchData leaves non-plain bodies untouched", async () => {
  let init: RequestInit | undefined;
  globalThis.fetch = async (_url, i) => ((init = i), Response.json({ ok: true }));

  const body = new URLSearchParams({ a: "1" });
  assert.deepEqual(await fetchData<{ ok: boolean }>("http://x", { method: "POST", body }), { ok: true });
  assert.equal(init?.body, body);
});


test("compareValues supports every operator", () => {
  assert.equal(compareValues(1, 1, "==="), true);
  assert.equal(compareValues(1, 2, "!=="), true);
  assert.equal(compareValues(2, 2, "<="), true);
  assert.equal(compareValues(2, 2, "<"), false);
  assert.equal(compareValues(2, 2, ">="), true);
  assert.equal(compareValues(3, 2, ">"), true);
  // @ts-expect-error invalid operator
  assert.throws(() => compareValues(1, 1, "=="), /Unsupported filter operator: ==/);
});




test("object iteration passes value, key and index", () => {
  const seen: string[] = [];
  forEachObj({ a: 1, b: 2 }, (v, { key, index, obj }) => {
    assert.equal(obj[key], v);
    seen.push(`${key}${v}${index}`);
  });
  assert.deepEqual(seen, ["a10", "b21"]);
  assert.deepEqual(mapObjToArr({ a: 1, b: 2 }, (v, { key }) => key + v), ["a1", "b2"]);
  assert.deepEqual(mapObj({}, () => 1), {});
});

test("string helpers handle edge cases", () => {
  assert.equal(assembleString("a", null, true, "b"), "ab");
  assert.equal(assembleString(), "");
  assert.equal(cleanString("  a   b \n c "), "a b c");
  assert.equal(capitalize(""), "");
  assert.equal(capitalize("hello world"), "Hello world");
  const all: boolean = true;
  assert.equal(capitalize("a b", all), "A B");
  assert.equal(camelCaseDivider("  helloWorld "), "hello world");
  assert.equal(camelCaseDivider("HelloBigWorld", true, true), "Hello Big World");
});

test("basic time conversions", () => {
  assert.equal(yearsToMonths(2), 24);
  assert.equal(yearsToDays(4), 1461);
  assert.equal(monthsToWeeks(12), 365.25 / 7);
  assert.equal(weeksToDays(2), 14);
  assert.equal(daysToHours(2), 48);
  assert.equal(hoursToMinutes(2), 120);
  assert.equal(minutesToSeconds(2), 120);
  assert.equal(secondsToMs(2), 2000);
  assert.equal(minutesToMs(1), 60_000);
  assert.equal(weeksToMs(1), 7 * daysToMs(1));
});

test("status codes map to FETCH_STATUS and FetchError keeps them", () => {
  assert.equal(getStatusError(400), FETCH_STATUS.INVALID);
  assert.equal(getStatusError(401), FETCH_STATUS.UNAUTHORIZED);
  assert.equal(getStatusError(404), FETCH_STATUS.NOT_FOUND);
  assert.equal(getStatusError(409), FETCH_STATUS.CONFLICT);
  assert.equal(getStatusError(500), FETCH_STATUS.ERROR);

  const err = new FetchError("x");
  assert.ok(err instanceof Error);
  assert.equal(err.name, "FetchError");
  assert.equal(err.status, FETCH_STATUS.ERROR);
  assert.equal(err.statusCode, undefined);
});

test("fetchData rejects with FetchError carrying status details", async () => {
  globalThis.fetch = async () => new Response("bad", { status: 401 });
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.UNAUTHORIZED);
    assert.equal(err.statusCode, 401);
    return true;
  });
});

test("fetchData wraps non-JSON success bodies in a FetchError", async () => {
  globalThis.fetch = async () => new Response("plain text");
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.statusCode, 200);
    assert.match(err.message, /\[Invalid JSON\]: plain text/);
    return true;
  });
});

test("fetchData keeps an existing content-type and does not stringify GET", async () => {
  let init: RequestInit | undefined;
  globalThis.fetch = async (_url, i) => ((init = i), Response.json([1]));

  await fetchData("http://x", { method: "PUT", headers: { "Content-Type": "application/vnd+json" }, body: [1] });
  assert.equal(init?.body, "[1]");
  assert.deepEqual(init?.headers, { "Content-Type": "application/vnd+json" });

  assert.deepEqual(await fetchData("http://x"), [1]);
  assert.equal(init?.method, "GET");
  assert.equal(init?.body, undefined);
});
