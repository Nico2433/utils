import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  FETCH_STATUS,
  FetchError,
  createFetchData,
  fetchData,
  getStatusError,
} from "../lib";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

// Replaces fetch and records every request so tests can inspect what was sent
const mockFetch = (response: () => Response | Promise<Response>) => {
  const calls: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return response();
  };
  return calls;
};

// Never responds, only rejects when the request signal aborts (like a slow server)
const hangingFetch = () => {
  globalThis.fetch = (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal!.reason));
    });
};

// Byte bodies don't get the automatic text/plain content-type that strings get
const untypedResponse = (body: string) => new Response(new TextEncoder().encode(body));

test("status codes map to FETCH_STATUS", () => {
  assert.equal(getStatusError(400), FETCH_STATUS.INVALID);
  assert.equal(getStatusError(401), FETCH_STATUS.UNAUTHORIZED);
  assert.equal(getStatusError(403), FETCH_STATUS.FORBIDDEN);
  assert.equal(getStatusError(404), FETCH_STATUS.NOT_FOUND);
  assert.equal(getStatusError(408), FETCH_STATUS.TIMEOUT);
  assert.equal(getStatusError(409), FETCH_STATUS.CONFLICT);
  assert.equal(getStatusError(422), FETCH_STATUS.INVALID);
  assert.equal(getStatusError(500), FETCH_STATUS.ERROR);
});

test("FetchError defaults and options", () => {
  const err = new FetchError("x");
  assert.ok(err instanceof Error);
  assert.equal(err.name, "FetchError");
  assert.equal(err.status, FETCH_STATUS.ERROR);
  assert.equal(err.statusCode, undefined);
  assert.equal(err.data, undefined);

  const cause = new Error("root");
  const full = new FetchError("y", FETCH_STATUS.NOT_FOUND, 404, { data: { a: 1 }, cause });
  assert.equal(full.status, FETCH_STATUS.NOT_FOUND);
  assert.equal(full.statusCode, 404);
  assert.deepEqual(full.data, { a: 1 });
  assert.equal(full.cause, cause);
});

test("encodes JSON bodies without mutating caller headers", async () => {
  const calls = mockFetch(() => new Response(null, { status: 204 }));

  const headers = { authorization: "x" };
  assert.equal(await fetchData("http://x", { method: "PATCH", headers, body: { a: 1 } }), null);
  const init = calls[0]!.init;
  assert.equal(init.method, "PATCH");
  assert.equal(init.body, '{"a":1}');
  assert.equal(new Headers(init.headers).get("content-type"), "application/json");
  assert.equal(new Headers(init.headers).get("authorization"), "x");
  assert.deepEqual(headers, { authorization: "x" });
});

test("keeps an existing content-type regardless of casing", async () => {
  const calls = mockFetch(() => Response.json([1]));
  await fetchData("http://x", { method: "PUT", headers: { "Content-Type": "application/vnd+json" }, body: [1] });
  assert.equal(calls[0]!.init.body, "[1]");
  assert.equal(new Headers(calls[0]!.init.headers).get("content-type"), "application/vnd+json");
});

test("leaves non-plain bodies untouched", async () => {
  const calls = mockFetch(() => Response.json({ ok: true }));
  const body = new URLSearchParams({ a: "1" });
  assert.deepEqual(await fetchData<{ ok: boolean }>("http://x", { method: "POST", body }), { ok: true });
  assert.equal(calls[0]!.init.body, body);
  assert.equal(new Headers(calls[0]!.init.headers).get("content-type"), null);
});

test("skips the request when condition is false", async () => {
  const calls = mockFetch(() => Response.json(1));
  assert.equal(await fetchData("http://x", {}, false), null);
  assert.equal(calls.length, 0);
  assert.equal(await fetchData("http://x", {}, true), 1);
});

test("parses by content-type: JSON, text, empty, or JSON-ish when missing", async () => {
  mockFetch(() => new Response("hola", { headers: { "content-type": "text/plain" } }));
  assert.equal(await fetchData("http://x"), "hola");

  // The declared content-type wins even if the text looks like JSON
  mockFetch(() => new Response('{"a":1}', { headers: { "content-type": "text/plain" } }));
  assert.equal(await fetchData("http://x"), '{"a":1}');

  mockFetch(() => new Response('{"a":1}', { headers: { "content-type": "application/problem+json" } }));
  assert.deepEqual(await fetchData("http://x"), { a: 1 });

  mockFetch(() => new Response(null, { status: 204 }));
  assert.equal(await fetchData("http://x"), null);

  mockFetch(() => untypedResponse('{"a":1}'));
  assert.deepEqual(await fetchData("http://x"), { a: 1 });

  mockFetch(() => untypedResponse("plain"));
  assert.equal(await fetchData("http://x"), "plain");
});

test("rejects malformed JSON responses with FetchError", async () => {
  mockFetch(() => new Response("{oops", { headers: { "content-type": "application/json" } }));
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.ERROR);
    assert.equal(err.statusCode, 200);
    assert.equal(err.data, "{oops");
    assert.ok(err.cause instanceof SyntaxError);
    return true;
  });
});

test("bad status rejects with FetchError carrying status, message and parsed data", async () => {
  mockFetch(() => new Response("nope", { status: 404, headers: { "content-type": "text/plain" } }));
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.NOT_FOUND);
    assert.equal(err.statusCode, 404);
    assert.equal(err.message, "[Error 404]: nope");
    assert.equal(err.data, "nope");
    return true;
  });

  mockFetch(() => Response.json({ message: "email taken" }, { status: 409 }));
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.CONFLICT);
    assert.deepEqual(err.data, { message: "email taken" });
    assert.equal(err.message, '[Error 409]: {"message":"email taken"}');
    return true;
  });

  // Malformed JSON error bodies keep the raw text
  mockFetch(() => new Response("{bad", { status: 500, headers: { "content-type": "application/json" } }));
  await assert.rejects(fetchData("http://x"), (err) => err instanceof FetchError && err.data === "{bad");
});

test("appends query params, skipping nullish and repeating arrays", async () => {
  const calls = mockFetch(() => Response.json(null));
  await fetchData("http://x/users", { query: { page: 2, q: "a b", tag: ["x", "y"], skip: undefined, no: null } });
  assert.equal(calls[0]!.url, "http://x/users?page=2&q=a+b&tag=x&tag=y");

  await fetchData("http://x/users?sort=asc", { query: { page: 1 } });
  assert.equal(calls[1]!.url, "http://x/users?sort=asc&page=1");

  const url = new URL("http://x/users");
  await fetchData(url, { query: { page: 1 } });
  assert.equal(calls[2]!.url, "http://x/users?page=1");
  assert.equal(url.search, "");

  await fetchData("http://x/users", { query: { a: undefined } });
  assert.equal(calls[3]!.url, "http://x/users");
});

test("createFetchData applies defaults that per-call options override", async () => {
  const calls = mockFetch(() => Response.json({}));
  const api = createFetchData({
    baseUrl: "http://api.test/v1/",
    headers: { authorization: "token" },
    query: { lang: "es" },
  });

  await api("/users", { headers: { "x-extra": "1" }, query: { page: 1 } });
  assert.equal(calls[0]!.url, "http://api.test/v1/users?lang=es&page=1");
  const headers = new Headers(calls[0]!.init.headers);
  assert.equal(headers.get("authorization"), "token");
  assert.equal(headers.get("x-extra"), "1");

  await api("users", { headers: { Authorization: "other" }, query: { lang: "en" } });
  assert.equal(calls[1]!.url, "http://api.test/v1/users?lang=en");
  assert.equal(new Headers(calls[1]!.init.headers).get("authorization"), "other");

  // Absolute URLs ignore baseUrl
  await api("https://other.test/x");
  assert.equal(calls[2]!.url, "https://other.test/x?lang=es");
});

test("createFetchData default timeout applies to every call", { timeout: 2000 }, async () => {
  hangingFetch();
  const api = createFetchData({ timeout: 10 });
  await assert.rejects(api("http://x"), (err) => err instanceof FetchError && err.status === FETCH_STATUS.TIMEOUT);
});

test("wraps network errors in FetchError", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(fetchData("http://x"), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.ERROR);
    assert.equal(err.statusCode, undefined);
    assert.equal(err.message, "[Network error]: fetch failed");
    assert.ok(err.cause instanceof TypeError);
    return true;
  });
});

test("fails with TIMEOUT after the given milliseconds", { timeout: 2000 }, async () => {
  hangingFetch();
  await assert.rejects(fetchData("http://x", { timeout: 10 }), (err) => {
    assert.ok(err instanceof FetchError);
    assert.equal(err.status, FETCH_STATUS.TIMEOUT);
    assert.equal(err.message, "[Timeout]: no response after 10ms");
    return true;
  });
});

test("rethrows caller aborts untouched", { timeout: 2000 }, async () => {
  hangingFetch();
  const controller = new AbortController();
  const promise = fetchData("http://x", { signal: controller.signal, timeout: 1000 });
  controller.abort();
  await assert.rejects(promise, (err) => {
    assert.ok(!(err instanceof FetchError));
    assert.equal((err as Error).name, "AbortError");
    return true;
  });
});

test("refuses a body on GET and HEAD before sending", async () => {
  const calls = mockFetch(() => Response.json(null));
  await assert.rejects(fetchData("http://x", { body: { a: 1 } }), /GET requests cannot have a body/);
  await assert.rejects(fetchData("http://x", { method: "HEAD", body: "a" }), /HEAD requests cannot have a body/);
  assert.equal(calls.length, 0);
});
