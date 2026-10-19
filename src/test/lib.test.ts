import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  addToArraySimple,
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
