# @nico2433/utils

Small, typed utilities for JavaScript/TypeScript projects. Functions are generic: they infer the types you work with, so wrong properties or values fail at compile time.

```bash
pnpm add @nico2433/utils
```

Works with ESM and CommonJS. Requires Node.js 22+ (or any runtime with `fetch`).

## Array

Every array function works with primitives and objects. Pass a property as `by` to compare that property; omit it to compare the items themselves. The value's type follows `by`, so mismatches fail at compile time.

None of them mutate the array they receive: they always return a new one.

```ts
import { filterArray, findOnArray, sortArray } from "@nico2433/utils";

const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Leo", active: false },
];

findOnArray(users, false, "active"); // { id: 2, ... }
findOnArray(users, "1", "id"); // ❌ type error: `id` is a number
findOnArray(["a", "b"], "b"); // "b"

filterArray(users, { by: "id", op: ">=", value: 2 });
filterArray(users, { by: "active", op: "===", value: true, exclude: true });
filterArray([1, 2, 3], { op: "<", value: 3 }); // [1, 2]

sortArray(users, { by: "name", order: "desc" });
sortArray([10, 2, 1]); // [1, 2, 10] (numeric, not lexicographic)
```

Sorted-array helpers use binary search, so the array **must already be sorted ascending** (by `by` when given):

```ts
import { addToArray, insertIndexOnArray, removeFromArray, searchIndexOnArray, searchOnArray } from "@nico2433/utils";

searchOnArray(users, 2, "id"); // { id: 2, ... }
searchIndexOnArray([1, 3, 5], 4); // -1
insertIndexOnArray([1, 3, 5], 4); // 2
addToArray(users, { id: 3, name: "Sol", active: true }, "id"); // inserted in order, skips duplicates
addToArray([1, 3], 2); // [1, 2, 3]
removeFromArray(users, 1, "id");
```

## Object

```ts
import { forEachObj, mapObj, mapObjToArr } from "@nico2433/utils";

mapObj({ a: 1, b: 2 }, (value, { key }) => `${key}${value}`); // { a: "a1", b: "b2" }
mapObjToArr({ a: 1, b: 2 }, (value) => value * 2); // [2, 4]
forEachObj({ a: 1 }, (value, { key, index }) => {});
```

## Fetch

```ts
import { fetchData, FetchError, FETCH_STATUS } from "@nico2433/utils";

const user = await fetchData<User>("/api/users/1");
await fetchData("/api/users", { method: "POST", body: { name: "Ana" } }); // sent as JSON

// Skips the request and resolves with null when the condition is false
const maybe = await fetchData<User>("/api/me", undefined, isLoggedIn);

try {
  await fetchData("/api/missing");
} catch (err) {
  if (err instanceof FetchError && err.status === FETCH_STATUS.NOT_FOUND) {
    // err.statusCode === 404
  }
}
```

- Plain objects and arrays are sent as JSON. `FormData`, `URLSearchParams`, `Blob` and strings are sent untouched.
- Empty responses (e.g. `204`) resolve with `null`.

## String

```ts
import { assembleStringWSpaces, camelCaseDivider, capitalize, cleanString } from "@nico2433/utils";

capitalize("hello"); // "Hello" (typed as "Hello")
capitalize("hello world", true); // "Hello World"
cleanString("  a   b "); // "a b"
camelCaseDivider("helloWorld", true); // "Hello world"
assembleStringWSpaces("btn", isActive && "btn-active"); // "btn btn-active" or "btn"
```

## Time

```ts
import { daysToMs, minutesToMs, yearsToMs } from "@nico2433/utils";

setTimeout(fn, minutesToMs(5));
daysToMs(1); // 86_400_000
```

Years use 365.25 days and months are 1/12 of a year, so `monthsToMs(12) === yearsToMs(1)`.

## License

MIT
