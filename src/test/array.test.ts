import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addToArray,
  compareValues,
  filterArray,
  findIndexOnArray,
  findOnArray,
  insertIndexOnArray,
  removeFromArray,
  searchIndexOnArray,
  searchOnArray,
  sortArray,
} from "../lib";

const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

const ids = (list: { id: number }[]) => list.map((u) => u.id);

test("compareValues returns true and false for every operator", () => {
  const cases = [
    ["===", 1, 1, true],
    ["===", 1, 2, false],
    ["!==", 1, 2, true],
    ["!==", 1, 1, false],
    ["<=", 2, 2, true],
    ["<=", 3, 2, false],
    ["<", 1, 2, true],
    ["<", 2, 2, false],
    [">=", 2, 2, true],
    [">=", 1, 2, false],
    [">", 3, 2, true],
    [">", 2, 2, false],
  ] as const;
  for (const [op, a, b, expected] of cases)
    assert.equal(compareValues<number>(a, b, op), expected, `${a} ${op} ${b}`);

  // @ts-expect-error invalid operator
  assert.throws(() => compareValues(1, 1, "=="), /Unsupported filter operator: ==/);
});

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
  assert.notEqual(addToArray(nums, 3), nums);
  assert.deepEqual(addToArray([], 1), [1]);
  assert.deepEqual(nums, [1, 3, 5]);

  const list = [{ id: 1 }, { id: 3 }];
  assert.deepEqual(ids(addToArray(list, { id: 2 }, "id")), [1, 2, 3]);
  assert.deepEqual(ids(addToArray(list, { id: 3 }, "id")), [1, 3]);
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

  const nums = [2, 10, 1];
  assert.deepEqual(sortArray(nums), [1, 2, 10]); // numeric, not lexicographic
  assert.deepEqual(sortArray(nums, { order: "desc" }), [10, 2, 1]);
  assert.deepEqual(sortArray(["b", "c", "a"]), ["a", "b", "c"]);
  assert.deepEqual(nums, [2, 10, 1]);
});

test("types follow `by` and reject mismatched values", () => {
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
  // @ts-expect-error unknown property
  sortArray(users, { by: "name" });
});
