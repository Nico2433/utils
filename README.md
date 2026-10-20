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
import { createFetchData, fetchData, FetchError, FETCH_STATUS } from "@nico2433/utils";

const user = await fetchData<User>("/api/users/1");
await fetchData("/api/users", { method: "POST", body: { name: "Ana" } }); // sent as JSON

// Query params: null/undefined are skipped, arrays repeat the key
await fetchData("/api/users", { query: { page: 2, tag: ["a", "b"], q: search || undefined } });

// Fails with FETCH_STATUS.TIMEOUT after 5s
await fetchData("/api/slow", { timeout: 5000 });

// Skips the request and resolves with null when the condition is false
const maybe = await fetchData<User>("/api/me", undefined, isLoggedIn);
```

Reusable client with defaults (base URL, headers, query, timeout, any `RequestInit` option). Per-call options override them:

```ts
const api = createFetchData({
  baseUrl: "https://api.example.com/v1",
  headers: { authorization: `Bearer ${token}` },
  timeout: 10_000,
});

await api<User[]>("/users", { query: { page: 1 } }); // https://api.example.com/v1/users?page=1
```

Every failure is a `FetchError` (except your own `AbortController` aborts, which are rethrown untouched so you can ignore them):

```ts
try {
  await api("/users", { method: "POST", body: form });
} catch (err) {
  if (err instanceof FetchError) {
    err.status; // FETCH_STATUS: INVALID (400/422), UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, TIMEOUT, ERROR
    err.statusCode; // 409, or undefined for network errors and timeouts
    err.data; // parsed error body, e.g. { message: "email taken" }
  }
}
```

- Plain objects and arrays are sent as JSON. `FormData`, `URLSearchParams`, `Blob` and strings are sent untouched.
- Responses are parsed by `content-type`: JSON for `*json`, text otherwise. Empty responses (e.g. `204`) resolve with `null`.
- `GET`/`HEAD` with a `body` throws a `TypeError` before sending anything.

## String

```ts
import { capitalize, camelCaseDivider, cleanString, cn, concat } from "@nico2433/utils";

cn("btn", isActive && "btn-active", { "btn-lg": large, "btn-sm": !large }); // "btn btn-active btn-lg"
cn("a", "", null, ["b", ["c"]]); // "a b c"
concat("/users/", id && `${id}`); // only string parts, no separator

capitalize("hello"); // "Hello" (typed as "Hello")
capitalize("hello world", true); // "Hello World"
cleanString("  a   b "); // "a b"
camelCaseDivider("helloWorld", true); // "Hello world"
```

## Time

```ts
import { daysToMs, minutesToMs, yearsToMs } from "@nico2433/utils";

setTimeout(fn, minutesToMs(5));
daysToMs(1); // 86_400_000
```

Years use 365.25 days and months are 1/12 of a year, so `monthsToMs(12) === yearsToMs(1)`.