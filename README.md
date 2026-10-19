# @nico2433/utils

Small, typed utilities for JavaScript/TypeScript projects. Functions are generic: they infer the types you work with, so wrong properties or values fail at compile time.

```bash
pnpm add @nico2433/utils
```

Works with ESM and CommonJS. Requires Node.js 22+ (or any runtime with `fetch`).

## Array

```ts
import {
  addToArray,
  filterArray,
  findOnArray,
  removeFromArray,
  searchOnArray,
  sortByArray,
} from "@nico2433/utils";

const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Leo", active: false },
];

findOnArray(users, { property: "active", value: false }); // { id: 2, ... }
findOnArray(users, { property: "id", value: "1" }); // ❌ type error: `id` is a number

filterArray(users, { property: "id", checkValue: { filterOp: ">=", value: 2 } });
filterArray(users, { property: "active", exclude: true }); // falsy `active`

sortByArray(users, "name", "desc");
```

Sorted-array helpers use binary search, so the array **must already be sorted ascending** by that property:

```ts
searchOnArray(users, { property: "id", value: 2 });
addToArray(users, { id: 3, name: "Sol", active: true }, { property: "id", value: 3 }); // skips duplicates
removeFromArray(users, { property: "id", value: 1 });
```

Every function has a `*Simple` variant for arrays of primitives (`findOnArraySimple`, `addToArraySimple`, ...).

> `add*`, `remove*` and `sort*` mutate the array they receive and return it.

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
