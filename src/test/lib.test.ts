import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  FETCH_STATUS,
  FetchError,
  addToArray,
  addToArraySimple,
  assembleString,
  cleanString,
  compareValues,
  daysToHours,
  filterArraySimple,
  findIndexOnArray,
  findIndexOnArraySimple,
  findOnArraySimple,
  forEachObj,
  getStatusError,
  hoursToMinutes,
  mapObjToArr,
  minutesToMs,
  minutesToSeconds,
  monthsToWeeks,
  removeFromArraySimple,
  searchIndexOnArray,
  searchOnArraySimple,
  secondsToMs,
  sortByArray,
  sortNumberArray,
  weeksToDays,
  weeksToMs,
  yearsToDays,
  yearsToMonths,
  assembleStringWSpaces,
  camelCaseDivider,
  fetchData,
  filterArray,
  findOnArray,
  mapObj,
  removeFromArray,
  searchOnArray,
  capitalize,
  daysToMs,
  monthsToMs,
  searchIndexOnArraySimple,
  yearsToMs,
} from "../lib";

const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

test("find matches falsy values", () => {
  assert.deepEqual(findOnArray(users, { property: "active", value: false }), users[1]);
});

test("binary search, add and remove keep sorted arrays", () => {
  assert.equal(searchOnArray(users, { property: "id", value: 3 }), users[2]);
  assert.deepEqual(addToArraySimple([1, 3, 5], 4), [1, 3, 4, 5]);
  assert.deepEqual(addToArraySimple([1, 3], 3), [1, 3]);
  assert.deepEqual(removeFromArray([...users], { property: "id", value: 2 }).map((u) => u.id), [1, 3]);
});

test("filter with operator and exclude", () => {
  const opts = { property: "id" as const, checkValue: { filterOp: ">=" as const, value: 2 } };
  assert.deepEqual(filterArray(users, opts).map((u) => u.id), [2, 3]);
  assert.deepEqual(filterArray(users, { ...opts, exclude: true }).map((u) => u.id), [1]);
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
  findOnArray(users, { property: "id", value: "1" });
  // @ts-expect-error `active` is a boolean
  filterArray(users, { property: "active", checkValue: { filterOp: "===", value: 1 } });
  // @ts-expect-error unknown property
  searchOnArray(users, { property: "name", value: 1 });

  const cap: "Hello" = capitalize("hello");
  const doubled: Record<"a" | "b", string> = mapObj({ a: 1, b: 2 }, (v, { key }) => key + v);
  assert.equal(cap, "Hello");
  assert.deepEqual(doubled, { a: "a1", b: "b2" });
});

test("binary search insertion at edges", () => {
  assert.deepEqual(addToArraySimple([], 1), [1]);
  assert.deepEqual(addToArraySimple([2, 3], 1), [1, 2, 3]);
  assert.deepEqual(addToArraySimple([1, 2], 3), [1, 2, 3]);
  assert.equal(searchIndexOnArraySimple([1, 3], 2), -1);
  assert.equal(searchIndexOnArraySimple([1, 3], 2, true), 1);
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

test("sort by property and numerically in both orders", () => {
  assert.deepEqual(sortByArray([{ n: 2 }, { n: 1 }, { n: 3 }], "n").map((x) => x.n), [1, 2, 3]);
  assert.deepEqual(sortByArray([{ n: 2 }, { n: 1 }, { n: 3 }], "n", "desc").map((x) => x.n), [3, 2, 1]);
  assert.deepEqual(sortNumberArray([10, 2, 1]), [1, 2, 10]);
  assert.deepEqual(sortNumberArray([10, 2, 1], "desc"), [10, 2, 1]);
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

test("filter without checkValue keeps truthy properties, filterSimple compares values", () => {
  assert.deepEqual(filterArray(users, { property: "active" }).map((u) => u.id), [1, 3]);
  assert.deepEqual(filterArray(users, { property: "active", exclude: true }).map((u) => u.id), [2]);
  assert.deepEqual(filterArraySimple([1, 2, 3, 4], { checkValue: { filterOp: "<", value: 3 } }), [1, 2]);
  assert.deepEqual(filterArraySimple([1, 2, 3], { checkValue: { filterOp: "===", value: 2 }, exclude: true }), [1, 3]);
  assert.deepEqual(filterArraySimple([], { checkValue: { filterOp: ">", value: 0 } }), []);
});

test("find helpers return index, item or not-found values", () => {
  assert.equal(findIndexOnArray(users, { property: "id", value: 3 }), 2);
  assert.equal(findIndexOnArray(users, { property: "id", value: 9 }), -1);
  assert.equal(findOnArray(users, { property: "id", value: 9 }), undefined);
  assert.equal(findOnArray([{ a: 0 }, { a: 5 }], { property: "a" })?.a, 5);
  assert.equal(findOnArraySimple(["a", "b"], "b"), "b");
  assert.equal(findOnArraySimple(["a"], "z"), undefined);
  assert.equal(findIndexOnArraySimple(["a", "b"], "b"), 1);
});

test("sorted add, search and remove by property and simple values", () => {
  const list = [{ id: 1 }, { id: 3 }];
  assert.deepEqual(addToArray(list, { id: 2 }, { property: "id", value: 2 }).map((x) => x.id), [1, 2, 3]);
  assert.equal(addToArray(list, { id: 3 }, { property: "id", value: 3 }).length, 3);
  assert.equal(searchIndexOnArray(list, { property: "id", value: 4 }), -1);
  assert.equal(searchIndexOnArray(list, { property: "id", value: 4 }, true), 3);
  assert.equal(searchOnArray(list, { property: "id", value: 4 }), undefined);
  assert.equal(searchOnArraySimple([1, 2, 3], 2), 2);
  assert.equal(searchOnArraySimple([1, 3], 2), undefined);
  assert.deepEqual(removeFromArraySimple([1, 2, 3], 2), [1, 3]);
  assert.deepEqual(removeFromArraySimple([1, 3], 2), [1, 3]);
  assert.deepEqual(removeFromArray([{ id: 1 }], { property: "id", value: 5 }), [{ id: 1 }]);
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
