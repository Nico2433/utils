import assert from "node:assert/strict";
import { test } from "node:test";
import { forEachObj, mapObj, mapObjToArr } from "../lib";

test("forEachObj passes value, key, index and the object", () => {
  const seen: string[] = [];
  forEachObj({ a: 1, b: 2 }, (v, { key, index, obj }) => {
    assert.equal(obj[key], v);
    seen.push(`${key}${v}${index}`);
  });
  assert.deepEqual(seen, ["a10", "b21"]);
});

test("mapObj keeps keys and mapObjToArr returns an array", () => {
  assert.deepEqual(mapObj({ a: 1, b: 2 }, (v) => v * 2), { a: 2, b: 4 });
  assert.deepEqual(mapObj({}, () => 1), {});
  assert.deepEqual(mapObjToArr({ a: 1, b: 2 }, (v, { key }) => key + v), ["a1", "b2"]);
  assert.deepEqual(mapObjToArr({}, () => 1), []);

  // Keys are kept in the return type
  const mapped: Record<"a" | "b", string> = mapObj({ a: 1, b: 2 }, (v, { key }) => key + v);
  assert.deepEqual(mapped, { a: "a1", b: "b2" });
});
